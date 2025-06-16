from django.db import models
from django.conf import settings
from django.utils import timezone


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


class UserPermission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="permissions")
    page = models.CharField(max_length=50, choices=PAGE_CHOICES)
    
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'page')  

    def __str__(self):
        return f"{self.user.email} - {self.get_page_display()}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    page = models.CharField(max_length=50, choices=PAGE_CHOICES)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.email} on {self.get_page_display()}"


class CommentHistory(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.SET_NULL, null=True, blank=True, related_name="histories")
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    old_text = models.TextField()
    new_text = models.TextField()
    modified_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for Comment {self.comment.id if self.comment else 'Deleted'} by {self.modified_by.email if self.modified_by else 'Unknown'}"

