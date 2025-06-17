from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.utils.crypto import get_random_string
from django.utils import timezone
from .models import PasswordResetOTP
from .serializers import (
    UserLoginSerializer,
    PasswordResetRequestSerializer,
    PasswordResetVerifyOTPSerializer,
    PasswordResetConfirmSerializer,
    UserProfileSerializer, CommentSerializer
)
from adminpanel.models import UserPermission, Comment, CommentHistory, PAGE_CHOICES
from django.shortcuts import get_object_or_404
User = get_user_model()

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)
        if user and not user.is_superadmin:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'email': user.email,
                }
            })
        return Response({'error': 'Invalid credentials or not a regular user.'}, status=401)


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        otp = get_random_string(6, allowed_chars='0123456789')
        PasswordResetOTP.objects.create(user=user, otp=otp)

        # Normally you'd email or SMS this
        return Response({'message': 'OTP sent successfully.', 'otp': otp}, status=200)


class PasswordResetVerifyOTPView(APIView):
    def post(self, request):
        serializer = PasswordResetVerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
            otp_obj = PasswordResetOTP.objects.filter(user=user, otp=otp).latest('created_at')
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({'error': 'Invalid email or OTP'}, status=400)

        if otp_obj.is_expired():
            otp_obj.delete()
            return Response({'error': 'OTP expired.'}, status=400)

        otp_obj.is_verified = True
        otp_obj.save()

        return Response({'message': 'OTP verified successfully.'}, status=200)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        try:
            otp_obj = PasswordResetOTP.objects.filter(user=user).latest('created_at')
        except PasswordResetOTP.DoesNotExist:
            return Response({'error': 'No OTP found. Request a new one.'}, status=400)

        if otp_obj.is_expired():
            otp_obj.delete()
            return Response({'error': 'OTP expired.'}, status=400)

        if not otp_obj.is_verified:
            return Response({'error': 'OTP not verified. Please verify before resetting.'}, status=400)

        user.set_password(new_password)
        user.save()

        otp_obj.delete()  # Clean up after use

        return Response({'message': 'Password reset successfully.'}, status=200)




class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully.'}, status=200)
        return Response(serializer.errors, status=400)




def get_user_permission(user, page):
    try:
        return UserPermission.objects.get(user=user, page=page)
    except UserPermission.DoesNotExist:
        return None


# 📌 API: List pages a user has permission for
class UserPagePermissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        permissions_qs = UserPermission.objects.filter(user=request.user)
        data = [
            {
                "page_key": p.page,                         # 'products_list'
                "page_label": p.get_page_display(),         # 'Products List'
                "can_view": p.can_view,
                "can_create": p.can_create,
                "can_edit": p.can_edit,
                "can_delete": p.can_delete
            }
            for p in permissions_qs
        ]
        return Response(data, status=status.HTTP_200_OK)



# 📌 API: List and create comments for a page
class UserPageCommentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, page):
        if page not in dict(PAGE_CHOICES):
            return Response({"detail": "Invalid page name."}, status=status.HTTP_400_BAD_REQUEST)

        permission = get_user_permission(request.user, page)

        if not permission:
            return Response({"detail": "You have no permissions on this page."}, status=status.HTTP_403_FORBIDDEN)

        if permission.can_view:
            comments = Comment.objects.filter(page=page)
        else:
            # User can only see their own comments if no view permission
            comments = Comment.objects.filter(page=page, user=request.user)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, page):
        if page not in dict(PAGE_CHOICES):
            return Response({"detail": "Invalid page name."}, status=status.HTTP_400_BAD_REQUEST)

        permission = get_user_permission(request.user, page)
        if not permission or not permission.can_create:
            return Response({"detail": "You don't have permission to add comments on this page."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, page=page)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 📌 API: Edit/Delete a specific comment (if user has permission and is owner)
class UserCommentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Comment, pk=pk)

    def put(self, request, pk):
        comment = self.get_object(pk)

        permission = get_user_permission(request.user, comment.page)
        if not permission or not permission.can_edit:
            return Response({"detail": "No edit permission on this page."}, status=status.HTTP_403_FORBIDDEN)

        old_text = comment.text
        serializer = CommentSerializer(comment, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()

            if 'text' in request.data and old_text != request.data['text']:
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
        
        permission = get_user_permission(request.user, comment.page)
        if not permission or not permission.can_delete:
            return Response({"detail": "No delete permission on this page."}, status=status.HTTP_403_FORBIDDEN)

        # Update comment text before deleting to preserve history
        comment_text = comment.text
        comment.text = "[Deleted by user]"
        comment.save()

        CommentHistory.objects.create(
            comment=comment,
            modified_by=request.user,
            old_text=comment_text,
            new_text="[Deleted by user]"
        )

        comment.delete()

        return Response({"detail": "Comment deleted successfully."}, status=status.HTTP_200_OK)
