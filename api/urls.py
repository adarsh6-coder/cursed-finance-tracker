from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('dashboard/', views.get_dashboard, name='get_dashboard'),
    path('expenses/add/', views.add_expense, name='add_expense'),
    path('expenses/', views.get_expenses, name='get_expenses'),
    path('expenses/delete/', views.delete_expense, name='delete_expense'),
    path('income/add/', views.add_income, name='add_income'),
    path('income/', views.get_income, name='get_income'),
    path('income/delete/', views.delete_income, name='delete_income'),
    path('budgets/set/', views.set_budget, name='set_budget'),
    path('budgets/', views.get_budgets, name='get_budgets'),
    path('history/', views.get_history, name='get_history'),
]
