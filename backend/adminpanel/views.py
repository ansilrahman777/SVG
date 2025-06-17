from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import AdminLoginSerializer, AssignPermissionsSerializer, UserCreateSerializer
from .serializers import UserPermissionsListSerializer,  CommentSerializer, CommentHistorySerializer, CountSerializer

from accounts.models import User
from .models import UserPermission, PAGE_CHOICES,Comment, CommentHistory
from .permissions import IsSuperAdmin 
from django.db import transaction


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
        users = User.objects.filter(is_superadmin=False).prefetch_related('permissions').order_by('-created_at')
        serializer = UserPermissionsListSerializer(users, many=True)
        return Response(serializer.data)

class AssignOrUpdatePermissionsView(APIView):
    
    permission_classes = [IsSuperAdmin]

    @transaction.atomic
    def post(self, request):
        serializer = AssignPermissionsSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            permissions_data = serializer.validated_data['permissions']
            user = User.objects.get(id=user_id)

            for perm_data in permissions_data:
                page = perm_data['page']
                perm_obj, created = UserPermission.objects.get_or_create(
                    user=user,
                    page=page
                )

                # Update only the permission fields provided in the request
                for field in ['can_view', 'can_create', 'can_edit', 'can_delete']:
                    if field in perm_data:
                        setattr(perm_obj, field, perm_data[field])

                # If all permissions are now False — delete permission record
                if not (perm_obj.can_view or perm_obj.can_create or perm_obj.can_edit or perm_obj.can_delete):
                    perm_obj.delete()
                    continue

                perm_obj.save()

            return Response({"detail": "Permissions assigned/updated successfully."})

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
            comment = serializer.save(user=request.user)

            # Create history record for added comment
            CommentHistory.objects.create(
                comment=comment,
                modified_by=request.user,
                action='added',
                old_text='',
                new_text=comment.text,
                details=f"Added comment: '{comment.text}'"
            )

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

    def patch(self, request, pk):
        comment = self.get_object(pk)
        if not comment:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        old_text = comment.text
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            new_text = request.data.get('text')
            if new_text is not None and old_text != new_text:
                CommentHistory.objects.create(
                    comment=comment,
                    modified_by=request.user,
                    action='edited',
                    old_text=old_text,
                    new_text=new_text,
                    details=f"Edited comment from '{old_text}' to '{new_text}'"
                )

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = self.get_object(pk)
        if not comment:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        CommentHistory.objects.create(
            comment=comment,
            modified_by=request.user,
            action='deleted',
            old_text=comment.text,
            new_text='[Deleted by Admin]',
            details=f"Deleted comment: '{comment.text}'"
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


class AdminAllCommentHistoriesView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        histories = CommentHistory.objects.all().order_by('-modified_at')
        serializer = CommentHistorySerializer(histories, many=True)
        return Response(serializer.data)


class DashboardCountsAPIView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        # Count users excluding super admins
        total_users = User.objects.filter(is_superadmin=False).count()
        
        # Count all comments
        total_comments = Comment.objects.count()

        data = {
            "total_users": total_users,
            "total_comments": total_comments,
        }
        serializer = CountSerializer(data)
        return Response(serializer.data)
