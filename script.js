let currentBalance = 0;
let transactions = [];
let selectedDate = new Date();
let userProfile = {
    name: "Aditya Raj",
    email: "abhishekraj19082008@gmail.com",
    currency: "₹"
};
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});
function initializeApp() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        currentBalance = transactions.reduce((total, transaction) => {
            return transaction.type === 'income' ? 
                   total + transaction.amount : 
                   total - transaction.amount;
        }, 0);
    }
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    }
    updateBalance();
    updateDateDisplay();
    updateYearMonthDisplay();
    updateDailySummary();
    updateHistory();
}
function setupEventListeners() {
    document.querySelector('.personalinfo').addEventListener('click', toggleProfileSidebar);
    document.getElementById('calendarBtn').addEventListener('click', showCalendarModal);
    document.querySelector('.year-button').addEventListener('click', showYearDropdown);
    document.querySelector('.month-button').addEventListener('click', showMonthDropdown);
    document.querySelector('.income').addEventListener('click', function() {
        showAddTransactionModal('income');
    });
    document.querySelector('.expences').addEventListener('click', function() {
        showAddTransactionModal('expense');
    });
    document.querySelector('.add').addEventListener('click', function() {
        showAddTransactionModal();
    });
    
    document.querySelector('.btn .fa-line-chart').closest('.btn').addEventListener('click', showGraphView);
    document.querySelector('.btn .fa-history').closest('.btn').addEventListener('click', showHistoryView);
    document.querySelector('.btn .fa-home').closest('.btn').addEventListener('click', showHomeView);
}
function updateBalance() {
    document.getElementById('currentBalance').textContent = 
        `${userProfile.currency}${currentBalance.toFixed(2)}`;
}
function updateDateDisplay() {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateElement = document.querySelector('.date');
    const dayElement = document.querySelector('.day');
    
    dateElement.textContent = selectedDate.toLocaleDateString('en-US', options);
    dayElement.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
}
function updateYearMonthDisplay() {
    const yearButton = document.querySelector('.year-button');
    const monthButton = document.querySelector('.month-button');
    
    yearButton.textContent = selectedDate.getFullYear();
    monthButton.textContent = selectedDate.toLocaleDateString('en-US', { month: 'long' });
}
function updateDailySummary() {
    const dailyExpenseElement = document.querySelector('.expence-per-day');
    const dailyIncomeElement = document.querySelector('.income-per-day');
    const dayTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === selectedDate.toDateString();
    });
    const dailyExpense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);
        
    const dailyIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);
    dailyExpenseElement.textContent = `Expense: ${userProfile.currency}${dailyExpense.toFixed(2)}`;
    dailyIncomeElement.textContent = `Income: ${userProfile.currency}${dailyIncome.toFixed(2)}`;
}
function updateHistory() {
    const historyElement = document.querySelector('.history-per-day');
    const dayTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === selectedDate.toDateString();
    });
    
    if (dayTransactions.length === 0) {
        historyElement.innerHTML = '<p>No transactions for this day</p>';
        return;
    }
    let historyHTML = '<div class="transaction-list">';
    dayTransactions.forEach(transaction => {
        historyHTML += `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-details">
                    <span class="transaction-category">${transaction.category}</span>
                    <span class="transaction-notes">${transaction.notes || ''}</span>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'} ${userProfile.currency}${transaction.amount.toFixed(2)}
                </div>
            </div>
        `;
    });
    historyHTML += '</div>';
    
    historyElement.innerHTML = historyHTML;
}
function toggleProfileSidebar() {
    let sidebar = document.getElementById('profile-sidebar');
    if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.id = 'profile-sidebar';
        sidebar.className = 'profile-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>User Profile</h3>
                <button class="close-sidebar">&times;</button>
            </div>
            <div class="sidebar-content">
                <div class="profile-info">
                    <div class="profile-name">${userProfile.name}</div>
                    <div class="profile-email">${userProfile.email}</div>
                </div>
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-label">Current Balance</span>
                        <span class="stat-value">${userProfile.currency}${currentBalance.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(sidebar);
        sidebar.querySelector('.close-sidebar').addEventListener('click', function() {
            sidebar.style.transform = 'translateX(-100%)';
            setTimeout(() => sidebar.remove(), 300);
        });
    }
    if (sidebar.style.transform === 'translateX(0%)') {
        sidebar.style.transform = 'translateX(-100%)';
    } else {
        sidebar.style.transform = 'translateX(0%)';
    }
}
function showCalendarModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Select Date</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="calendar" id="datepicker"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    initializeCalendar(modal.querySelector('#datepicker'));
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
function initializeCalendar(container) {
    const current = new Date(selectedDate);
    const year = current.getFullYear();
    const month = current.getMonth();
    let calendarHTML = `
        <div class="calendar-header">
            <button class="prev-month">&lt;</button>
            <div class="month-year">${current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            <button class="next-month">&gt;</button>
        </div>
        <div class="calendar-weekdays">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div class="calendar-days"></div>
    `;
    
    container.innerHTML = calendarHTML;
    const daysContainer = container.querySelector('.calendar-days');
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        daysContainer.appendChild(emptyCell);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            dayCell.classList.add('selected');
        }
        dayCell.addEventListener('click', function() {
            selectedDate = new Date(year, month, day);
            updateDateDisplay();
            updateDailySummary();
            updateHistory();
            container.closest('.modal').remove();
        });
        
        daysContainer.appendChild(dayCell);
    }
    container.querySelector('.prev-month').addEventListener('click', function() {
        const newDate = new Date(year, month - 1, 1);
        initializeCalendar(container);
    });
    container.querySelector('.next-month').addEventListener('click', function() {
        const newDate = new Date(year, month + 1, 1);
        initializeCalendar(container);
    });
}
function showYearDropdown() {
    const currentYear = selectedDate.getFullYear();
    const yearDropdown = document.createElement('div');
    yearDropdown.className = 'dropdown year-dropdown';
    
    let yearsHTML = '';
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        yearsHTML += `<div class="dropdown-item" data-year="${year}">${year}</div>`;
    }
    yearDropdown.innerHTML = yearsHTML;
    document.querySelector('.year').appendChild(yearDropdown);

    yearDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const year = parseInt(this.getAttribute('data-year'));
            selectedDate.setFullYear(year);
            updateYearMonthDisplay();
            updateDailySummary();
            updateHistory();
            yearDropdown.remove();
        });
    });
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.year-dropdown') && !e.target.closest('.year-button')) {
            yearDropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}
function showMonthDropdown() {
    const monthDropdown = document.createElement('div');
    monthDropdown.className = 'dropdown month-dropdown';
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let monthsHTML = '';
    months.forEach((month, index) => {
        monthsHTML += `<div class="dropdown-item" data-month="${index}">${month}</div>`;
    });
    monthDropdown.innerHTML = monthsHTML;
    document.querySelector('.month').appendChild(monthDropdown);
    monthDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const month = parseInt(this.getAttribute('data-month'));
            selectedDate.setMonth(month);
            updateYearMonthDisplay();
            updateDailySummary();
            updateHistory();
            monthDropdown.remove();
        });
    });
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.month-dropdown') && !e.target.closest('.month-button')) {
            monthDropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}
function showAddTransactionModal(type = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    const transactionType = type || 'income';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add ${transactionType === 'income' ? 'Income' : 'Expense'}</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="add-transaction-form">
                    <div class="form-group">
                        <label for="amount">Amount (${userProfile.currency})</label>
                        <input type="number" id="amount" step="0.01" min="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" required>
                            ${transactionType === 'income' ? 
                                '<option value="Salary">Salary</option><option value="Freelance">Freelance</option><option value="Investment">Investment</option><option value="Gift">Gift</option>' : 
                                '<option value="Food">Food</option><option value="Transport">Transport</option><option value="Entertainment">Entertainment</option><option value="Utilities">Utilities</option><option value="Shopping">Shopping</option>'}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" id="date" value="${selectedDate.toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="notes">Notes (optional)</label>
                        <textarea id="notes" rows="2"></textarea>
                    </div>
                    <button type="submit">Add ${transactionType === 'income' ? 'Income' : 'Expense'}</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    modal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        addTransaction(
            transactionType,
            parseFloat(modal.querySelector('#amount').value),
            modal.querySelector('#category').value,
            new Date(modal.querySelector('#date').value),
            modal.querySelector('#notes').value
        );
        modal.remove();
    });
}
function addTransaction(type, amount, category, date, notes = '') {
    const transaction = {
        id: Date.now(),
        type,
        amount,
        category,
        date: date.toISOString(),
        notes,
        createdAt: new Date().toISOString()
    };
    
    transactions.push(transaction);
    if (type === 'income') {
        currentBalance += amount;
    } else {
        currentBalance -= amount;
    }
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateBalance();
    updateDailySummary();
    updateHistory();
}
function showGraphView() {
    alert('Graph view will be implemented here');
}
function showHistoryView() {
    alert('History view will be implemented here');
}
function showHomeView() {
    selectedDate = new Date();
    updateDateDisplay();
    updateYearMonthDisplay();
    updateDailySummary();
    updateHistory();
}
const additionalStyles = `
    /* Profile sidebar */
    .profile-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 100%;
        background-color: rgb(101, 101, 85);
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        padding: 20px;
        box-shadow: 2px 0 10px rgba(0,0,0,0.2);
    }
    
    .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(235, 235, 126, 0.3);
    }
    
    .close-sidebar {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: rgb(235, 235, 126);
    }
    
    .profile-info {
        margin-bottom: 20px;
    }
    
    .profile-name {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .profile-email {
        font-size: 14px;
        opacity: 0.8;
    }
    
    .stat {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 10px;
        background-color: rgba(0,0,0,0.1);
        border-radius: 5px;
    }
    
    /* Modal styles */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background-color: rgb(101, 101, 85);
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(235, 235, 126, 0.3);
    }
    
    .close-modal {
        font-size: 24px;
        cursor: pointer;
    }
    
    /* Form styles */
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
    }
    
    .form-group input, .form-group select, .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid rgba(235, 235, 126, 0.3);
        border-radius: 4px;
        background-color: rgba(0,0,0,0.1);
        color: rgb(235, 235, 126);
    }
    
    .form-group textarea {
        resize: vertical;
    }
    
    button[type="submit"] {
        background-color: rgb(235, 235, 126);
        color: black;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    
    /* Calendar styles */
    .calendar {
        width: 100%;
    }
    
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .calendar-header button {
        background: none;
        border: none;
        color: rgb(235, 235, 126);
        font-size: 18px;
        cursor: pointer;
    }
    
    .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
    }
    
    .calendar-days div {
        text-align: center;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
    }
    
    .calendar-days div:hover {
        background-color: rgba(235, 235, 126, 0.2);
    }
    
    .calendar-days div.selected {
        background-color: rgb(235, 235, 126);
        color: black;
    }
    
    /* Dropdown styles */
    .dropdown {
        position: absolute;
        background-color: rgb(101, 101, 85);
        border: 1px solid rgba(235, 235, 126, 0.3);
        border-radius: 4px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 100;
    }
    
    .dropdown-item {
        padding: 10px;
        cursor: pointer;
    }
    
    .dropdown-item:hover {
        background-color: rgba(235, 235, 126, 0.2);
    }
    
    /* Transaction list styles */
    .transaction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        background-color: rgba(0,0,0,0.1);
        border-radius: 4px;
    }
    
    .transaction-details {
        flex: 1;
    }
    
    .transaction-category {
        font-weight: bold;
        display: block;
    }
    
    .transaction-notes {
        font-size: 12px;
        opacity: 0.8;
    }
    
    .transaction-amount.income {
        color: lightgreen;
    }
    
    .transaction-amount.expense {
        color: lightcoral;
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);