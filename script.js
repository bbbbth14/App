/* ==================== UTILS ==================== */
function formatVND(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ==================== FINANCE TRACKER ==================== */
const financeForm = document.getElementById('finance-form');
const financeList = document.getElementById('finance-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');  // NOW EXISTS
const balanceEl = document.getElementById('balance');
const filterCategory = document.getElementById('filter-category');

let finances = JSON.parse(localStorage.getItem('finances')) || [];

financeForm.addEventListener('submit', e => {
    e.preventDefault();
    const desc = document.getElementById('finance-description').value.trim();
    const type = document.getElementById('finance-type').value;
    const amount = parseFloat(document.getElementById('finance-amount').value);
    const cat = document.getElementById('finance-category').value;
    const date = document.getElementById('finance-date').value;

    if (!desc || !type || isNaN(amount) || amount <= 0 || !cat || !date) {
        alert('Please fill all fields correctly.');
        return;
    }

    const entry = {
        id: Date.now(),
        description: desc,
        type,
        amount: type === 'Income' ? amount : -amount,
        rawAmount: amount,
        category: cat,
        date
    };
    finances.push(entry);
    saveFinances();
    renderFinances(finances);
    updateFinanceSummary();
    financeForm.reset();
});

financeList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = +e.target.dataset.id;
        finances = finances.filter(f => f.id !== id);
        saveFinances();
        renderFinances(finances);
        updateFinanceSummary();
    }
});

filterCategory.addEventListener('change', e => {
    const cat = e.target.value;
    const filtered = cat === 'All' ? finances : finances.filter(f => f.category === cat);
    renderFinances(filtered);
});

function renderFinances(list) {
    financeList.innerHTML = '';
    list.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${f.description}</td>
            <td>${f.type}</td>
            <td>${formatVND(f.rawAmount)} ₫</td>
            <td>${f.category}</td>
            <td>${f.date}</td>
            <td><button class="delete-btn" data-id="${f.id}">Delete</button></td>
        `;
        financeList.appendChild(tr);
    });
}

function updateFinanceSummary() {
    const inc = finances.filter(f => f.type === 'Income').reduce((s, f) => s + f.rawAmount, 0);
    const exp = finances.filter(f => f.type === 'Expense').reduce((s, f) => s + f.rawAmount, 0);
    totalIncomeEl.textContent = formatVND(inc);
    totalExpensesEl.textContent = formatVND(exp);
    balanceEl.textContent = formatVND(inc - exp);
}

function saveFinances() {
    localStorage.setItem('finances', JSON.stringify(finances));
}

/* ==================== INVESTMENT TRACKER – WORKING ==================== */
const investmentForm = document.getElementById('investment-form');
const investmentList = document.getElementById('investment-list');
const totalPortfolioEl = document.getElementById('total-portfolio');

let investments = JSON.parse(localStorage.getItem('investments')) || [];

investmentForm.addEventListener('submit', e => {
    e.preventDefault();

    const symbol = document.getElementById('investment-symbol').value.trim().toUpperCase();
    const amount = parseFloat(document.getElementById('investment-amount').value);

    if (!symbol || isNaN(amount) || amount <= 0 || amount % 1000 !== 0) {
        alert('Please enter a valid symbol and amount (multiple of 1,000 ₫)');
        return;
    }

    const newInv = { id: Date.now(), symbol, amount };
    investments.push(newInv);
    saveInvestments();
    refreshInvestments();
    investmentForm.reset();
});

investmentList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = +e.target.dataset.id;
        investments = investments.filter(i => i.id !== id);
        saveInvestments();
        refreshInvestments();
    }
});

function refreshInvestments() {
    investmentList.innerHTML = '';
    let total = 0;

    investments.forEach(inv => {
        total += inv.amount;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${inv.symbol}</td>
            <td>${formatVND(inv.amount)} ₫</td>
            <td>${formatVND(inv.amount)} ₫</td>
            <td><button class="delete-btn" data-id="${inv.id}">Delete</button></td>
        `;
        investmentList.appendChild(row);
    });

    totalPortfolioEl.textContent = formatVND(total);
}

function saveInvestments() {
    localStorage.setItem('investments', JSON.stringify(investments));
}

/* ==================== INIT ==================== */
renderFinances(finances);
updateFinanceSummary();
refreshInvestments();