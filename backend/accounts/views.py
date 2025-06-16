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
    UserProfileSerializer
)

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
