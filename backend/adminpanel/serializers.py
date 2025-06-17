from rest_framework import serializers
from accounts.models import User
from django.utils.crypto import get_random_string
from .models import UserPermission, PAGE_CHOICES, Comment, CommentHistory
from django.contrib.auth import get_user_model

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password']

    def create(self, validated_data):
        password = get_random_string(12)
        user = User.objects.create_user(email=validated_data['email'], password=password)
        user.save()
        validated_data['password'] = password
        return validated_data


User = get_user_model()

class UserPermissionSerializer(serializers.ModelSerializer):
    page_display = serializers.CharField(source='get_page_display', read_only=True)
    
    class Meta:
        model = UserPermission
        fields = ['page', 'page_display', 'can_view', 'can_create', 'can_edit', 'can_delete']

class UserPermissionsListSerializer(serializers.ModelSerializer):
    permissions = UserPermissionSerializer(many=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'permissions']

PAGE_CHOICES = (
    ('products_list', 'Products List'),
    ('marketing_list', 'Marketing List'),
    ('order_list', 'Order List'),
    ('media_plans', 'Media Plans'),
    ('offer_pricing_skus', 'Offer Pricing SKUs'),
    ('clients', 'Clients'),
    ('suppliers', 'Suppliers'),
    ('customer_support', 'Customer Support'),
    ('sales_reports', 'Sales Reports'),
    ('finance_accounting', 'Finance & Accounting'),
)
class PermissionItemSerializer(serializers.Serializer):
    page = serializers.ChoiceField(choices=PAGE_CHOICES)
    can_view = serializers.BooleanField(default=False)
    can_create = serializers.BooleanField(default=False)
    can_edit = serializers.BooleanField(default=False)
    can_delete = serializers.BooleanField(default=False)

class AssignPermissionsSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    permissions = PermissionItemSerializer(many=True)

    def validate_user_id(self, value):
        if not User.objects.filter(id=value, is_superuser=False).exists():
            raise serializers.ValidationError("User not found or is a superuser.")
        return value


class CommentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_email', 'page', 'text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class CommentHistorySerializer(serializers.ModelSerializer):
    modified_by_email = serializers.SerializerMethodField()
    comment_id = serializers.SerializerMethodField()

    class Meta:
        model = CommentHistory
        fields = ['id', 'comment_id', 'modified_by_email', 'old_text', 'new_text', 'action', 'modified_at']

    def get_modified_by_email(self, obj):
        return obj.modified_by.email if obj.modified_by else None

    def get_comment_id(self, obj):
        return obj.comment.id if obj.comment else None

class CountSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_comments = serializers.IntegerField()