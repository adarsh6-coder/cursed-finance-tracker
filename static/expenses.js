document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupLogout();
    loadExpenses();
    
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        expenseForm.addEventListener('submit', handleAddExpense);
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

async function handleAddExpense(e) {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/api/expenses/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                amount: amount,
                category: category,
                date: date,
                description: description
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Expense added successfully!', 'success');
            document.getElementById('expenseForm').reset();
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            loadExpenses();
        } else {
            showMessage(data.message || 'Failed to add expense', 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function loadExpenses() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`/api/expenses/?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
            displayExpenses(data.expenses);
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

function displayExpenses(expenses) {
    const container = document.getElementById('expensesList');
    
    if (!expenses || expenses.length === 0) {
        container.innerHTML = '<p class="no-data">No expenses recorded yet</p>';
        return;
    }

    let html = '';
    expenses.forEach(expense => {
        html += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">${expense.category}</div>
                    <div class="transaction-description">${expense.description || 'No description'}</div>
                    <div class="transaction-date">${formatDate(expense.transaction_date)}</div>
                </div>
                <div class="transaction-amount expense">$${parseFloat(expense.amount).toFixed(2)}</div>
                <button class="btn-secondary" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        const response = await fetch('/api/expenses/delete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                expenseId: expenseId
            })
        });

        const data = await response.json();

        if (data.success) {
            loadExpenses();
        } else {
            alert('Failed to delete expense');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
