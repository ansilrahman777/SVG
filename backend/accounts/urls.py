from django.urls import path
from .views import (
    UserLoginView, 
    PasswordResetRequestView, 
    PasswordResetVerifyOTPView, 
    PasswordResetConfirmView,
    UserProfileView
)

urlpatterns = [
    path('login/', UserLoginView.as_view()),
    path('request-otp/', PasswordResetRequestView.as_view()),
    path('verify-otp/', PasswordResetVerifyOTPView.as_view()),
    path('reset-password/', PasswordResetConfirmView.as_view()),
    path('profile/', UserProfileView.as_view()),
]
