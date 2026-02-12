from django.contrib import admin
from .models import User, Expense, Income, Budget

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'full_name', 'is_verified')
    search_fields = ('username', 'email', 'full_name')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'category', 'transaction_date')
    list_filter = ('category', 'transaction_date')
    search_fields = ('user__username', 'description')

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'source', 'frequency', 'transaction_date')
    list_filter = ('frequency', 'transaction_date')
    search_fields = ('user__username', 'source')

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'monthly_limit', 'month', 'year')
    list_filter = ('category', 'month', 'year')
    search_fields = ('user__username',)
