from django.contrib import admin

from .models import UserPermission, Comment, CommentHistory

admin.site.register(UserPermission)
admin.site.register(Comment)
admin.site.register(CommentHistory)
