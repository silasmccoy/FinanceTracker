const formElement = document.getElementById('form');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expenseElement = document.getElementById('expense');
const transactionHistoryElement = document.getElementById('transaction-list');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

formElement.addEventListener('submit', function(event) {
    event.preventDefault();

    const date = dateInput.value;
    const description = descriptionInput.value;
    const amount = amountInput.value;
    const type = typeSelect.value;
    const category = categorySelect.value;
    
    if (!date || !description || !amount || !type || !category) {
        alert("Please fill in all fields before adding a transaction.");
        return;
    }

    const transaction = {
        id: Date.now(),
        date: date,
        text: description,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    renderTransactions();

    dateInput.value = '';
    descriptionInput.value = '';
    amountInput.value = '';
    typeSelect.selectedIndex = 0;
    categorySelect.selectedIndex = 0;
    
    updateBalances();

    console.log(transactions);
});

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderTransactions() {
    transactionHistoryElement.innerHTML = '';

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const transactionElement = document.createElement('li');

        let formattedDate = '';
        if (transaction.date) {
            const [year, month, day] = transaction.date.split('-');
            formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
        } else {
            formattedDate = new Date(transaction.id).toLocaleDateString('en-US');
        }

        const numAmount = parseFloat(transaction.amount);
        const formattedAmount = isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);

        transactionElement.innerHTML = `
            <span class="col-date">${formattedDate}</span>
            <span class="col-desc">${transaction.text}</span>
            <span class="col-amount">$${formattedAmount}</span>
            <span class="col-type">${capitalizeFirstLetter(transaction.type)}</span>
            <span class="col-category">${capitalizeFirstLetter(transaction.category)}</span>
            <div class="close-cell"></div>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('close-btn');
        deleteButton.setAttribute('aria-label', 'Close');
        deleteButton.textContent = '✕';
        deleteButton.addEventListener('click', function() {
            deleteTransaction(transaction.id);
        });

        transactionElement.querySelector('.close-cell').appendChild(deleteButton);
        transactionHistoryElement.appendChild(transactionElement);
    }
}

function updateBalances() {
    let totalIncome = 0;
    let totalExpense = 0;
    let balance = 0;

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const val = parseFloat(transaction.amount) || 0;

        if (transaction.type === 'income') {
            totalIncome += val;
        } else if (transaction.type === 'expense') {
            totalExpense += val;
        }
    }
    balance = totalIncome - totalExpense;

    balanceElement.innerText = `Balance: $${balance.toFixed(2)}`;
    incomeElement.innerText = `Income: $${totalIncome.toFixed(2)}`;
    expenseElement.innerText = `Expenses: $${totalExpense.toFixed(2)}`;
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateBalances();
}

renderTransactions();
updateBalances();