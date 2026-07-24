// ======================================
// USER & ELEMENTS
// ======================================

const email = localStorage.getItem("loggedInUser");

const monthFilter = document.getElementById("monthFilter");

const income = document.getElementById("income");
const expense = document.getElementById("expense");
const savings = document.getElementById("savings");
const totalTransactions = document.getElementById("totalTransactions");

const categorySummary =
    document.getElementById("categorySummary");

const reportTable =
    document.getElementById("reportTable");

const aiInsights =
    document.getElementById("aiInsights");

// ======================================
// PAGINATION
// ======================================

const rowsPerPage = 5;

let currentPage = 1;

let allTransactions = [];

// ======================================
// INITIALIZE
// ======================================

monthFilter.value =
    new Date().toISOString().slice(0,7);

document.getElementById("reportEmail").textContent =
    email;

document.getElementById("generatedDate").textContent =
    new Date().toLocaleString();

monthFilter.addEventListener(
    "change",
    loadPageData
);

loadPageData();

// ======================================
// FORMATTERS
// ======================================

function formatCurrency(amount){

    return new Intl.NumberFormat(

        "en-IN",

        {

            style:"currency",

            currency:"INR"

        }

    ).format(amount || 0);

}

function formatDate(date){

    if(!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");

}

// ======================================
// LOAD REPORT DATA
// ======================================

function loadPageData(){

    const month = monthFilter.value;

    fetch(

        `http://127.0.0.1:8002/reports/${email}?month=${month}`

    )

    .then(response => response.json())

    .then(data => {

        allTransactions = data.transactions;

        currentPage = 1;

        // ==================================
        // SUMMARY CARDS
        // ==================================

        income.textContent =
            formatCurrency(data.total_income);

        expense.textContent =
            formatCurrency(data.total_expense);

        savings.textContent =
            formatCurrency(data.savings);

        totalTransactions.textContent =
            allTransactions.length;

        // ==================================
        // CATEGORY SUMMARY
        // ==================================

        categorySummary.innerHTML = "";

        const categoryTotals = {};

        allTransactions.forEach(transaction => {

            const category =
                transaction.category || "Others";

            categoryTotals[category] =
                (categoryTotals[category] || 0)
                + Number(transaction.amount);

        });

        if(Object.keys(categoryTotals).length === 0){

            categorySummary.innerHTML = `

            <tr>

                <td colspan="2"
                style="text-align:center;padding:20px;">

                    No category data available.

                </td>

            </tr>

            `;

        }

        else{

            Object.entries(categoryTotals)

            .sort((a,b)=>b[1]-a[1])

            .forEach(([category,total])=>{

                categorySummary.innerHTML += `

                <tr>

                    <td>${category}</td>

                    <td>${formatCurrency(total)}</td>

                </tr>

                `;

            });

        }

        // ==================================
        // AI INSIGHTS
        // ==================================

        aiInsights.innerHTML = "";

        const highestCategory =
            Object.entries(categoryTotals)

            .sort((a,b)=>b[1]-a[1])[0];

        aiInsights.innerHTML += `

        <li>

            💰 Monthly Income:
            <strong>${formatCurrency(data.total_income)}</strong>

        </li>

        `;

        aiInsights.innerHTML += `

        <li>

            💸 Monthly Expense:
            <strong>${formatCurrency(data.total_expense)}</strong>

        </li>

        `;

        aiInsights.innerHTML += `

        <li>

            💵 Net Savings:
            <strong>${formatCurrency(data.savings)}</strong>

        </li>

        `;

        if(highestCategory){

            aiInsights.innerHTML += `

            <li>

                📊 Highest Spending Category:
                <strong>${highestCategory[0]}</strong>

                (${formatCurrency(highestCategory[1])})

            </li>

            `;

        }

        if(data.total_income > 0){

            const savingsRate = (

                (data.savings / data.total_income) * 100

            ).toFixed(1);

            aiInsights.innerHTML += `

            <li>

                📈 Savings Rate:
                <strong>${savingsRate}%</strong>

            </li>

            `;

            if(savingsRate >= 30){

                aiInsights.innerHTML += `

                <li>

                    ✅ Excellent saving habits this month.

                </li>

                `;

            }

            else if(savingsRate >= 15){

                aiInsights.innerHTML += `

                <li>

                    👍 Your finances are stable, but there's room to save more.

                </li>

                `;

            }

            else{

                aiInsights.innerHTML += `

                <li>

                    ⚠️ Savings are relatively low. Consider reducing discretionary expenses.

                </li>

                `;

            }

        }

        // ==================================
        // PAGINATED TRANSACTION TABLE
        // ==================================

        renderTransactionTable();

        renderPagination();

    })

    .catch(error=>{

        console.error("Report Error:",error);

        categorySummary.innerHTML = `

        <tr>

            <td colspan="2">

                Unable to load report.

            </td>

        </tr>

        `;

        reportTable.innerHTML = `

        <tr>

            <td colspan="5">

                Unable to load report.

            </td>

        </tr>

        `;

        aiInsights.innerHTML =

            "<li>Unable to generate AI insights.</li>";

    });

}
// ======================================
// RENDER TRANSACTION TABLE
// ======================================

function renderTransactionTable(){

    reportTable.innerHTML = "";

    if(allTransactions.length === 0){

        reportTable.innerHTML = `

        <tr>

            <td colspan="5"
            style="text-align:center;padding:30px;">

                No transactions found for this month.

            </td>

        </tr>

        `;

        return;

    }

    const start =
        (currentPage - 1) * rowsPerPage;

    const end =
        start + rowsPerPage;

    const pageTransactions =
        allTransactions.slice(start, end);

    pageTransactions.forEach(transaction => {

        reportTable.innerHTML += `

        <tr>

            <td>${formatDate(transaction.date)}</td>

            <td>${transaction.notes || "-"}</td>

            <td>${transaction.category}</td>

            <td>${transaction.payment_mode}</td>

            <td>${formatCurrency(transaction.amount)}</td>

        </tr>

        `;

    });

}

// ======================================
// RENDER PAGINATION
// ======================================

function renderPagination(){

    const paginationInfo =
        document.getElementById("paginationInfo");

    const paginationControls =
        document.getElementById("paginationControls");

    paginationControls.innerHTML = "";

    if(allTransactions.length === 0){

        paginationInfo.textContent =
            "Showing 0 transactions";

        return;

    }

    const totalPages =
        Math.ceil(allTransactions.length / rowsPerPage);

    const start =
        (currentPage - 1) * rowsPerPage + 1;

    const end =
        Math.min(
            currentPage * rowsPerPage,
            allTransactions.length
        );

    paginationInfo.textContent =

        `Showing ${start}-${end} of ${allTransactions.length} transactions`;

    // ==========================
    // Previous Button
    // ==========================

    const prevBtn =
        document.createElement("button");

    prevBtn.innerHTML = "◀";

    prevBtn.className = "page-btn";

    prevBtn.disabled =
        currentPage === 1;

    prevBtn.onclick = () => {

        currentPage--;

        renderTransactionTable();

        renderPagination();

    };

    paginationControls.appendChild(prevBtn);

    // ==========================
    // Page Numbers
    // ==========================

    for(let i = 1; i <= totalPages; i++){

        const btn =
            document.createElement("button");

        btn.innerHTML = i;

        btn.className = "page-btn";

        if(i === currentPage){

            btn.classList.add("active");

        }

        btn.onclick = () => {

            currentPage = i;

            renderTransactionTable();

            renderPagination();

        };

        paginationControls.appendChild(btn);

    }

    // ==========================
    // Next Button
    // ==========================

    const nextBtn =
        document.createElement("button");

    nextBtn.innerHTML = "▶";

    nextBtn.className = "page-btn";

    nextBtn.disabled =
        currentPage === totalPages;

    nextBtn.onclick = () => {

        currentPage++;

        renderTransactionTable();

        renderPagination();

    };

    paginationControls.appendChild(nextBtn);

}

// ======================================
// EXPORT FUNCTIONS
// ======================================

function downloadCSV(){

    const month = monthFilter.value;

    window.open(

        `http://127.0.0.1:8002/reports/download/csv/${email}?month=${month}`,

        "_blank"

    );

}

function downloadPDF(){

    const month = monthFilter.value;

    window.open(

        `http://127.0.0.1:8002/reports/download/pdf/${email}?month=${month}`,

        "_blank"

    );

}

function printReport(){

    window.print();

}

function refreshReport(){

    loadPageData();

}

// ======================================
// SUMMARY DATA
// ======================================

function getSummaryData(){

    return{

        email,

        month:monthFilter.value,

        income:income.innerText,

        expense:expense.innerText,

        savings:savings.innerText,

        transactions:totalTransactions.innerText

    };

}

// ======================================
// KEYBOARD SHORTCUT
// ======================================

document.addEventListener("keydown",event=>{

    if(event.ctrlKey && event.key==="p"){

        event.preventDefault();

        printReport();

    }

});

// ======================================
// PAGE READY
// ======================================

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Reports page loaded successfully.");

});