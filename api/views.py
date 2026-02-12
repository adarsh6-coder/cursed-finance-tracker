from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.db.models import Sum, Q
from datetime import datetime
import json
from .models import User, Expense, Income, Budget

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            full_name = data.get('fullName')
            email = data.get('email')
            password = data.get('password')
            
            if not all([full_name, email, password]):
                return JsonResponse({'success': False, 'message': 'All fields are required'})
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email already registered'})
            
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                full_name=full_name
            )
            
            return JsonResponse({'success': True, 'message': 'Registration successful'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            user = authenticate(username=email, password=password)
            
            if user is not None:
                return JsonResponse({
                    'success': True,
                    'userId': user.id,
                    'userName': user.full_name
                })
            else:
                return JsonResponse({'success': False, 'message': 'Invalid email or password'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def get_dashboard(request):
    user_id = request.GET.get('userId')
    
    if not user_id:
        return JsonResponse({'success': False, 'message': 'User ID required'})
    
    try:
        user = User.objects.get(id=user_id)
        
        total_income = Income.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
        total_expenses = Expense.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
        
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        budgets = Budget.objects.filter(user=user, month=current_month, year=current_year).values()
        
        expenses_by_category = {}
        expenses_data = Expense.objects.filter(
            user=user,
            transaction_date__month=current_month,
            transaction_date__year=current_year
        ).values('category').annotate(total=Sum('amount'))
        
        for item in expenses_data:
            expenses_by_category[item['category']] = float(item['total'])
        
        expenses_list = list(Expense.objects.filter(user=user).values(
            'id', 'amount', 'category', 'description', 'transaction_date'
        )[:5])
        
        income_list = list(Income.objects.filter(user=user).values(
            'id', 'amount', 'source', 'frequency', 'transaction_date'
        )[:5])
        
        recent_transactions = []
        for exp in expenses_list:
            recent_transactions.append({
                'type': 'expense',
                'id': exp['id'],
                'amount': str(exp['amount']),
                'category': exp['category'],
                'description': exp['description'],
                'transaction_date': exp['transaction_date'].strftime('%Y-%m-%d'),
                'source': None,
                'frequency': None
            })
        
        for inc in income_list:
            recent_transactions.append({
                'type': 'income',
                'id': inc['id'],
                'amount': str(inc['amount']),
                'source': inc['source'],
                'frequency': inc['frequency'],
                'transaction_date': inc['transaction_date'].strftime('%Y-%m-%d'),
                'category': None,
                'description': None
            })
        
        recent_transactions.sort(key=lambda x: x['transaction_date'], reverse=True)
        recent_transactions = recent_transactions[:10]
        
        return JsonResponse({
            'success': True,
            'totalIncome': float(total_income),
            'totalExpenses': float(total_expenses),
            'budgets': list(budgets),
            'expensesByCategory': expenses_by_category,
            'recentTransactions': recent_transactions
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('userId')
            amount = data.get('amount')
            category = data.get('category')
            date = data.get('date')
            description = data.get('description', '')
            
            user = User.objects.get(id=user_id)
            
            Expense.objects.create(
                user=user,
                amount=amount,
                category=category,
                description=description,
                transaction_date=date
            )
            
            return JsonResponse({'success': True, 'message': 'Expense added successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def get_expenses(request):
    user_id = request.GET.get('userId')
    
    if not user_id:
        return JsonResponse({'success': False, 'message': 'User ID required'})
    
    try:
        user = User.objects.get(id=user_id)
        expenses = Expense.objects.filter(user=user).values(
            'id', 'amount', 'category', 'description', 'transaction_date'
        )
        
        expenses_list = []
        for exp in expenses:
            expenses_list.append({
                'id': exp['id'],
                'amount': str(exp['amount']),
                'category': exp['category'],
                'description': exp['description'],
                'transaction_date': exp['transaction_date'].strftime('%Y-%m-%d')
            })
        
        return JsonResponse({'success': True, 'expenses': expenses_list})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
def delete_expense(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            expense_id = data.get('expenseId')
            
            Expense.objects.filter(id=expense_id).delete()
            
            return JsonResponse({'success': True, 'message': 'Expense deleted successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def add_income(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('userId')
            amount = data.get('amount')
            source = data.get('source')
            frequency = data.get('frequency')
            date = data.get('date')
            is_recurring = data.get('isRecurring', False)
            
            user = User.objects.get(id=user_id)
            
            Income.objects.create(
                user=user,
                amount=amount,
                source=source,
                frequency=frequency,
                is_recurring=is_recurring,
                transaction_date=date
            )
            
            return JsonResponse({'success': True, 'message': 'Income added successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def get_income(request):
    user_id = request.GET.get('userId')
    
    if not user_id:
        return JsonResponse({'success': False, 'message': 'User ID required'})
    
    try:
        user = User.objects.get(id=user_id)
        income = Income.objects.filter(user=user).values(
            'id', 'amount', 'source', 'frequency', 'is_recurring', 'transaction_date'
        )
        
        income_list = []
        for inc in income:
            income_list.append({
                'id': inc['id'],
                'amount': str(inc['amount']),
                'source': inc['source'],
                'frequency': inc['frequency'],
                'is_recurring': inc['is_recurring'],
                'transaction_date': inc['transaction_date'].strftime('%Y-%m-%d')
            })
        
        return JsonResponse({'success': True, 'income': income_list})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
def delete_income(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            income_id = data.get('incomeId')
            
            Income.objects.filter(id=income_id).delete()
            
            return JsonResponse({'success': True, 'message': 'Income deleted successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def set_budget(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('userId')
            category = data.get('category')
            monthly_limit = data.get('monthlyLimit')
            month = data.get('month')
            year = data.get('year')
            
            user = User.objects.get(id=user_id)
            
            Budget.objects.update_or_create(
                user=user,
                category=category,
                month=month,
                year=year,
                defaults={'monthly_limit': monthly_limit}
            )
            
            return JsonResponse({'success': True, 'message': 'Budget set successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def get_budgets(request):
    user_id = request.GET.get('userId')
    
    if not user_id:
        return JsonResponse({'success': False, 'message': 'User ID required'})
    
    try:
        user = User.objects.get(id=user_id)
        
        budgets = Budget.objects.filter(user=user).values(
            'id', 'category', 'monthly_limit', 'month', 'year'
        ).order_by('-year', '-month')
        
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        expenses_by_category = {}
        expenses_data = Expense.objects.filter(
            user=user,
            transaction_date__month=current_month,
            transaction_date__year=current_year
        ).values('category').annotate(total=Sum('amount'))
        
        for item in expenses_data:
            expenses_by_category[item['category']] = float(item['total'])
        
        budgets_list = []
        for budget in budgets:
            budgets_list.append({
                'id': budget['id'],
                'category': budget['category'],
                'monthly_limit': str(budget['monthly_limit']),
                'month': budget['month'],
                'year': budget['year']
            })
        
        return JsonResponse({
            'success': True,
            'budgets': budgets_list,
            'expensesByCategory': expenses_by_category
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

def get_history(request):
    user_id = request.GET.get('userId')
    filter_type = request.GET.get('type', 'all')
    filter_category = request.GET.get('category', 'all')
    search_term = request.GET.get('search', '')
    start_date = request.GET.get('startDate', '')
    end_date = request.GET.get('endDate', '')
    
    if not user_id:
        return JsonResponse({'success': False, 'message': 'User ID required'})
    
    try:
        user = User.objects.get(id=user_id)
        
        transactions = []
        
        if filter_type in ['all', 'expense']:
            expenses = Expense.objects.filter(user=user)
            
            if filter_category != 'all':
                expenses = expenses.filter(category=filter_category)
            
            if search_term:
                expenses = expenses.filter(description__icontains=search_term)
            
            if start_date:
                expenses = expenses.filter(transaction_date__gte=start_date)
            
            if end_date:
                expenses = expenses.filter(transaction_date__lte=end_date)
            
            for exp in expenses.values('id', 'amount', 'category', 'description', 'transaction_date'):
                transactions.append({
                    'type': 'expense',
                    'id': exp['id'],
                    'amount': str(exp['amount']),
                    'category': exp['category'],
                    'description': exp['description'],
                    'transaction_date': exp['transaction_date'].strftime('%Y-%m-%d'),
                    'source': None,
                    'frequency': None
                })
        
        if filter_type in ['all', 'income']:
            income = Income.objects.filter(user=user)
            
            if search_term:
                income = income.filter(source__icontains=search_term)
            
            if start_date:
                income = income.filter(transaction_date__gte=start_date)
            
            if end_date:
                income = income.filter(transaction_date__lte=end_date)
            
            for inc in income.values('id', 'amount', 'source', 'frequency', 'transaction_date'):
                transactions.append({
                    'type': 'income',
                    'id': inc['id'],
                    'amount': str(inc['amount']),
                    'source': inc['source'],
                    'frequency': inc['frequency'],
                    'transaction_date': inc['transaction_date'].strftime('%Y-%m-%d'),
                    'category': None,
                    'description': None
                })
        
        transactions.sort(key=lambda x: x['transaction_date'], reverse=True)
        
        return JsonResponse({'success': True, 'transactions': transactions})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
