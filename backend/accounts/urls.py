from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserCommentDetailView,
    UserLoginView, 
    PasswordResetRequestView, 
    PasswordResetVerifyOTPView, 
    PasswordResetConfirmView,
    UserPageCommentsView,
    UserPagePermissionsView,
    UserProfileView
)

urlpatterns = [
    path('login/', UserLoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('request-otp/', PasswordResetRequestView.as_view()),
    path('verify-otp/', PasswordResetVerifyOTPView.as_view()),
    path('reset-password/', PasswordResetConfirmView.as_view()),
    path('profile/', UserProfileView.as_view()),
    
    path('my-pages/', UserPagePermissionsView.as_view()),
    path('page-comments/<str:page>/', UserPageCommentsView.as_view()),
    path('my-comment/<int:pk>/', UserCommentDetailView.as_view()),
]
