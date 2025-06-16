from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PasswordResetOTP

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'is_superadmin', 'is_active', 'is_staff')
    list_filter = ('is_superadmin', 'is_active', 'is_staff')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'mobile', 'dob')}),
        ('Permissions', {'fields': ('is_superadmin', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    search_fields = ('email',)

admin.site.register(User, UserAdmin)
admin.site.register(PasswordResetOTP)
