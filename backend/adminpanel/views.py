from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import AdminLoginSerializer, UserCreateSerializer
from .serializers import UserPermissionsListSerializer, AssignPermissionSerializer, CommentSerializer, CommentHistorySerializer

from accounts.models import User
from .models import UserPermission, PAGE_CHOICES,Comment, CommentHistory
from .permissions import IsSuperAdmin 

from django.contrib.auth import get_user_model
User = get_user_model()

class AdminLoginView(APIView):
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)
        if user and user.is_superadmin:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'error': 'Invalid credentials or not a super admin'}, status=401)


class AdminLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Frontend should delete tokens — JWT stateless by default.
        return Response({'detail': 'Logged out successfully.'}, status=200)


class CreateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_superadmin:
            return Response({'error': 'Only super admins can create users.'}, status=403)

        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.save()
            return Response({
                'message': 'User created successfully.',
                'email': user_data['email'],
                'password': user_data['password']
            }, status=201)
        return Response(serializer.errors, status=400)

class ListUsersPermissionsView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        users = User.objects.filter(is_superadmin=False).prefetch_related('permissions')
        serializer = UserPermissionsListSerializer(users, many=True)
        return Response(serializer.data)

class AssignOrUpdatePermissionView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):
        serializer = AssignPermissionSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            page = serializer.validated_data['page']

            user = User.objects.get(id=user_id)

            perm, created = UserPermission.objects.get_or_create(
                user=user,
                page=page
            )

            # Check if any permission flags provided, else raise error
            permission_fields = ['can_view', 'can_create', 'can_edit', 'can_delete']
            if not any(field in request.data for field in permission_fields):
                return Response(
                    {"detail": "At least one permission field must be provided."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update only the fields provided in request.data
            for field in permission_fields:
                if field in request.data:
                    setattr(perm, field, request.data[field])

            # If all permissions are False after update — delete the permission record
            if not any([perm.can_view, perm.can_create, perm.can_edit, perm.can_delete]):
                perm.delete()
                return Response(
                    {"detail": "Permissions removed for this page."},
                    status=status.HTTP_204_NO_CONTENT
                )

            perm.save()

            return Response({
                "detail": "Permissions assigned/updated successfully.",
                "permissions": {
                    "page": perm.page,
                    "can_view": perm.can_view,
                    "can_create": perm.can_create,
                    "can_edit": perm.can_edit,
                    "can_delete": perm.can_delete,
                }
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCommentListCreateView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        comments = Comment.objects.all().order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCommentDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get_object(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return None
        
    def get(self, request, pk):
        comment = self.get_object(pk)
        if not comment:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk):
        comment = self.get_object(pk)
        if not comment:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        old_text = comment.text
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Save comment edit history
            if old_text != request.data.get('text'):
                CommentHistory.objects.create(
                    comment=comment,
                    modified_by=request.user,
                    old_text=old_text,
                    new_text=request.data['text']
                )

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = self.get_object(pk)
        if not comment:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        # Save comment delete history before actual delete
        CommentHistory.objects.create(
            comment=comment,
            modified_by=request.user,
            old_text=comment.text,
            new_text="Comment deleted.",
        )

        comment.delete()

        return Response({"detail": "Comment deleted successfully."}, status=status.HTTP_200_OK)



class AdminCommentListGroupedByPageView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        result = {}
        for code, label in PAGE_CHOICES:
            comments = Comment.objects.filter(page=code).order_by('-created_at')
            serializer = CommentSerializer(comments, many=True)
            result[label] = serializer.data
        return Response(result)


class AdminCommentHistoryView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, comment_id):
        histories = CommentHistory.objects.filter(comment_id=comment_id).order_by('-modified_at')
        if not histories.exists():
            return Response({"detail": "No modification history found for this comment."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CommentHistorySerializer(histories, many=True)
        return Response(serializer.data)  

