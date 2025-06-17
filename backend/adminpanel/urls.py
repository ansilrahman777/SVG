from django.urls import path
from .views import AdminLoginView, AdminLogoutView, AssignOrUpdatePermissionsView, CreateUserView, ListUsersPermissionsView, DashboardCountsAPIView
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('login/', AdminLoginView.as_view()),
    path('logout/', AdminLogoutView.as_view()),
    path('create-user/', CreateUserView.as_view()),
     path('users-permissions/', ListUsersPermissionsView.as_view(), name='users-permissions-list'),
    path('assign-permission/', AssignOrUpdatePermissionsView.as_view(), name='assign-update-permission'),
    
    path('adminpanel/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('admin-comments/', views.AdminCommentListGroupedByPageView.as_view()),
    path('admin-comments-create/', views.AdminCommentListCreateView.as_view()),
    path('admin-comments/<int:pk>/', views.AdminCommentDetailView.as_view()),
    path('admin-all-comment-histories/', views.AdminAllCommentHistoriesView.as_view(), name='admin-all-comment-histories'),

    path('dashboard/counts/', DashboardCountsAPIView.as_view(), name='dashboard-counts'),
]
