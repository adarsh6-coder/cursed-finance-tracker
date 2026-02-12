document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupLogout();
    loadTransactions();
    setupFilters();
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

function setupFilters() {
    populateCategoryFilter();
    
    document.getElementById('applyFilters').addEventListener('click', loadTransactions);
}

function populateCategoryFilter() {
    const categories = ['Groceries', 'Utilities', 'Entertainment', 'Dining Out', 
                       'Transportation', 'Clothing', 'Healthcare', 'Other'];
    
    const filterCategory = document.getElementById('filterCategory');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

async function loadTransactions() {
    const userId = localStorage.getItem('userId');
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const searchTerm = document.getElementById('searchTerm').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        const params = new URLSearchParams({
            userId: userId,
            type: filterType,
            category: filterCategory,
            search: searchTerm,
            startDate: startDate,
            endDate: endDate
        });

        const response = await fetch(`/api/history/?${params}`);
        const data = await response.json();

        if (data.success) {
            displayTransactions(data.transactions);
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactionList');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p class="no-data">No transactions found</p>';
        return;
    }

    let html = '<div style="margin-bottom: 1rem; font-weight: 600;">Total Transactions: ' + transactions.length + '</div>';
    
    transactions.forEach(transaction => {
        const isExpense = transaction.type === 'expense';
        const amountClass = isExpense ? 'expense' : 'income';
        const sign = isExpense ? '-' : '+';
        
        html += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">
                        ${transaction.category || transaction.source}
                        <span style="background: ${isExpense ? '#dc3545' : '#28a745'}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.75rem; margin-left: 8px;">
                            ${isExpense ? 'Expense' : 'Income'}
                        </span>
                    </div>
                    <div class="transaction-description">${transaction.description || transaction.frequency || 'No description'}</div>
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
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
    });
}
