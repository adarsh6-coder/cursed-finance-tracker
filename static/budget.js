document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupLogout();
    loadBudgets();
    
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        const currentDate = new Date();
        document.getElementById('month').value = currentDate.getMonth() + 1;
        document.getElementById('year').value = currentDate.getFullYear();
        budgetForm.addEventListener('submit', handleSetBudget);
    }
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

async function handleSetBudget(e) {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    const category = document.getElementById('category').value;
    const monthlyLimit = document.getElementById('monthlyLimit').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;

    try {
        const response = await fetch('/api/budgets/set/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                category: category,
                monthlyLimit: monthlyLimit,
                month: month,
                year: year
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Budget set successfully!', 'success');
            document.getElementById('budgetForm').reset();
            const currentDate = new Date();
            document.getElementById('month').value = currentDate.getMonth() + 1;
            document.getElementById('year').value = currentDate.getFullYear();
            loadBudgets();
        } else {
            showMessage(data.message || 'Failed to set budget', 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function loadBudgets() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`/api/budgets/?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
            displayBudgets(data.budgets, data.expensesByCategory);
        }
    } catch (error) {
        console.error('Error loading budgets:', error);
    }
}

function displayBudgets(budgets, expensesByCategory) {
    const container = document.getElementById('budgetOverview');
    
    if (!budgets || budgets.length === 0) {
        container.innerHTML = '<p class="no-data">No budgets set yet</p>';
        return;
    }

    let html = '';
    budgets.forEach(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        const remaining = budget.monthly_limit - spent;
        const percentage = Math.min((spent / budget.monthly_limit) * 100, 100);
        
        let progressClass = '';
        if (percentage >= 100) {
            progressClass = 'danger';
        } else if (percentage >= 80) {
            progressClass = 'warning';
        }

        const monthName = getMonthName(budget.month);

        html += `
            <div class="budget-item">
                <div class="budget-header">
                    <div>
                        <div class="budget-category">${budget.category}</div>
                        <div class="budget-amount">${monthName} ${budget.year}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.1rem; font-weight: 600;">$${spent.toFixed(2)} / $${parseFloat(budget.monthly_limit).toFixed(2)}</div>
                        <div style="color: ${remaining >= 0 ? '#28a745' : '#dc3545'}; font-size: 0.9rem;">
                            ${remaining >= 0 ? '$' + remaining.toFixed(2) + ' remaining' : '$' + Math.abs(remaining).toFixed(2) + ' over budget'}
                        </div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${percentage}%">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function getMonthName(monthNumber) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}
