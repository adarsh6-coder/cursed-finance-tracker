document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupLogout();
    loadIncome();
    
    const incomeForm = document.getElementById('incomeForm');
    if (incomeForm) {
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        incomeForm.addEventListener('submit', handleAddIncome);
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

async function handleAddIncome(e) {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    const amount = document.getElementById('amount').value;
    const source = document.getElementById('source').value;
    const frequency = document.getElementById('frequency').value;
    const date = document.getElementById('date').value;
    const isRecurring = document.getElementById('isRecurring').checked;

    try {
        const response = await fetch('/api/income/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                amount: amount,
                source: source,
                frequency: frequency,
                date: date,
                isRecurring: isRecurring
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Income added successfully!', 'success');
            document.getElementById('incomeForm').reset();
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            loadIncome();
        } else {
            showMessage(data.message || 'Failed to add income', 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function loadIncome() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`/api/income/?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
            displayIncome(data.income);
        }
    } catch (error) {
        console.error('Error loading income:', error);
    }
}

function displayIncome(income) {
    const container = document.getElementById('incomeList');
    
    if (!income || income.length === 0) {
        container.innerHTML = '<p class="no-data">No income recorded yet</p>';
        return;
    }

    let html = '';
    income.forEach(item => {
        const recurringBadge = item.is_recurring ? '<span style="color: #28a745; font-size: 0.85rem;">(Recurring)</span>' : '';
        html += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">${item.source} ${recurringBadge}</div>
                    <div class="transaction-description">${item.frequency}</div>
                    <div class="transaction-date">${formatDate(item.transaction_date)}</div>
                </div>
                <div class="transaction-amount income">$${parseFloat(item.amount).toFixed(2)}</div>
                <button class="btn-secondary" onclick="deleteIncome(${item.id})">Delete</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function deleteIncome(incomeId) {
    if (!confirm('Are you sure you want to delete this income entry?')) {
        return;
    }

    try {
        const response = await fetch('/api/income/delete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                incomeId: incomeId
            })
        });

        const data = await response.json();

        if (data.success) {
            loadIncome();
        } else {
            alert('Failed to delete income');
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
