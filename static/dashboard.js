document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboardData();
    setupLogout();
});

function checkAuth() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.href = 'login.html';
        });
    }
}

async function loadDashboardData() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`/api/dashboard/?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalIncome').textContent = '$' + parseFloat(data.totalIncome).toFixed(2);
            document.getElementById('totalExpenses').textContent = '$' + parseFloat(data.totalExpenses).toFixed(2);
            
            const balance = parseFloat(data.totalIncome) - parseFloat(data.totalExpenses);
            document.getElementById('balance').textContent = '$' + balance.toFixed(2);
            
            displayBudgetSummary(data.budgets, data.expensesByCategory);
            displayRecentTransactions(data.recentTransactions);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayBudgetSummary(budgets, expensesByCategory) {
    const summaryDiv = document.getElementById('budgetSummary');
    
    if (!budgets || budgets.length === 0) {
        summaryDiv.innerHTML = '<p class="no-data">No budgets set</p>';
        return;
    }

    let overBudgetCount = 0;
    budgets.forEach(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        const percentage = (spent / budget.monthly_limit) * 100;
        if (percentage >= 100) {
            overBudgetCount++;
        }
    });

    if (overBudgetCount > 0) {
        summaryDiv.innerHTML = `<span style="color: #dc3545;">${overBudgetCount} budget(s) exceeded</span>`;
    } else {
        summaryDiv.innerHTML = '<span style="color: #28a745;">All budgets on track</span>';
    }
}

function displayRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactions');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p class="no-data">No transactions yet</p>';
        return;
    }

    let html = '';
    transactions.slice(0, 5).forEach(transaction => {
        const isExpense = transaction.type === 'expense';
        const amountClass = isExpense ? 'expense' : 'income';
        const sign = isExpense ? '-' : '+';
        
        html += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">${transaction.category || transaction.source}</div>
                    <div class="transaction-description">${transaction.description || transaction.frequency || ''}</div>
                    <div class="transaction-date">${formatDate(transaction.transaction_date)}</div>
                </div>
                <div class="transaction-amount ${amountClass}">${sign}$${parseFloat(transaction.amount).toFixed(2)}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
