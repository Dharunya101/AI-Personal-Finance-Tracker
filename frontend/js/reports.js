// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

// ======================================
// Month Filter
// ======================================

const monthFilter = document.getElementById("monthFilter");

// Default = Current Month
monthFilter.value = new Date().toISOString().slice(0, 7);

// Initial Load
loadPageData();

// Reload when month changes
monthFilter.addEventListener("change", loadPageData);

// ======================================
// Load Report
// ======================================

function loadPageData() {

    const month = monthFilter.value;

    fetch(
        `http://127.0.0.1:8002/reports/${email}?month=${month}`
    )

    .then(response => response.json())

    .then(data => {

        // ==========================================
        // User Information
        // ==========================================

        document.getElementById("reportEmail").innerHTML = email;

        document.getElementById("generatedDate").innerHTML =
            new Date().toLocaleString();

        // ==========================================
        // Summary Cards
        // ==========================================

        document.getElementById("income").innerHTML =
            new Intl.NumberFormat("en-IN", {

                style: "currency",

                currency: "INR"

            }).format(data.total_income);

        document.getElementById("expense").innerHTML =
            new Intl.NumberFormat("en-IN", {

                style: "currency",

                currency: "INR"

            }).format(data.total_expense);

        document.getElementById("savings").innerHTML =
            new Intl.NumberFormat("en-IN", {

                style: "currency",

                currency: "INR"

            }).format(data.savings);

        document.getElementById("totalTransactions").innerHTML =
            data.transactions.length;

        // ==========================================
        // Category Summary
        // ==========================================

        const categoryTable =
            document.getElementById("categorySummary");

        categoryTable.innerHTML = "";

        const categoryTotals = {};

        data.transactions.forEach(transaction => {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;

            }

            categoryTotals[transaction.category] +=
                Number(transaction.amount);

        });

        Object.keys(categoryTotals).forEach(category => {

            categoryTable.innerHTML += `

            <tr>

                <td>${category}</td>

                <td>

                    ${new Intl.NumberFormat("en-IN", {

                        style: "currency",

                        currency: "INR"

                    }).format(categoryTotals[category])}

                </td>

            </tr>

            `;

        });

        // ==========================================
        // AI Insights
        // ==========================================

        const aiInsights =
            document.getElementById("aiInsights");

        aiInsights.innerHTML = "";

        let highestCategory = "";

        let highestAmount = 0;

        Object.keys(categoryTotals).forEach(category => {

            if (categoryTotals[category] > highestAmount) {

                highestAmount = categoryTotals[category];

                highestCategory = category;

            }

        });

        aiInsights.innerHTML += `

            <li>

            💰 Total Income :
            ${new Intl.NumberFormat("en-IN", {

                style: "currency",

                currency: "INR"

            }).format(data.total_income)}

            </li>

        `;

        aiInsights.innerHTML += `

            <li>

            💸 Total Expense :
            ${new Intl.NumberFormat("en-IN", {

                style: "currency",

                currency: "INR"

            }).format(data.total_expense)}

            </li>

        `;

        aiInsights.innerHTML += `

            <li>

            💵 Savings :
            ${new Intl.NumberFormat("en-IN", {

                style: "currency",

                currency: "INR"

            }).format(data.savings)}

            </li>

        `;

        if (highestCategory !== "") {

            aiInsights.innerHTML += `

                <li>

                📊 Highest Spending Category :
                <b>${highestCategory}</b>

                </li>

            `;

        }

        if (data.total_income > 0) {

            const savingsRate =
                ((data.savings / data.total_income) * 100).toFixed(1);

            aiInsights.innerHTML += `

                <li>

                ⭐ Savings Rate :
                <b>${savingsRate}%</b>

                </li>

            `;

        }

        if (highestCategory !== "") {

            aiInsights.innerHTML += `

                <li>

                💡 Recommendation :

                Try reducing spending on
                <b>${highestCategory}</b>
                to improve your monthly savings.

                </li>

            `;

        }

        // ==========================================
        // Transaction Table
        // ==========================================

        const table =
            document.getElementById("reportTable");

        table.innerHTML = "";

        if (data.transactions.length === 0) {

            table.innerHTML = `

            <tr>

                <td colspan="5"
                style="text-align:center;padding:20px;">

                No transactions found for this month.

                </td>

            </tr>

            `;

            return;

        }

        data.transactions.forEach(transaction => {

            table.innerHTML += `

            <tr>

                <td>${transaction.date}</td>

                <td>${transaction.notes}</td>

                <td>${transaction.category}</td>

                <td>${transaction.payment_mode}</td>

                <td>

                    ${new Intl.NumberFormat("en-IN", {

                        style: "currency",

                        currency: "INR"

                    }).format(transaction.amount)}

                </td>

            </tr>

            `;

        });

    })

    .catch(error => {

        console.log(error);

        alert("Unable to load report.");

    });

}
// ======================================
// Download CSV
// ======================================

function downloadCSV() {

    const month = monthFilter.value;

    window.open(

        `http://127.0.0.1:8002/reports/download/csv/${email}?month=${month}`,

        "_blank"

    );

}


// ======================================
// Download PDF
// ======================================

function downloadPDF() {

    const month = monthFilter.value;

    window.open(

        `http://127.0.0.1:8002/reports/download/pdf/${email}?month=${month}`,

        "_blank"

    );

}


// ======================================
// Print Report
// ======================================

function printReport() {

    window.print();

}


// ======================================
// Refresh Report
// ======================================

function refreshReport() {

    loadPageData();

}


// ======================================
// Export Summary (Optional)
// ======================================

function getSummaryData() {

    return {

        email: email,

        month: monthFilter.value,

        income: document.getElementById("income").innerText,

        expense: document.getElementById("expense").innerText,

        savings: document.getElementById("savings").innerText,

        transactions:
            document.getElementById("totalTransactions").innerText

    };

}


// ======================================
// Format Currency
// ======================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR"

    }).format(amount);

}


// ======================================
// Format Date
// ======================================

function formatDate(dateString) {

    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-IN");

}


// ======================================
// Print Shortcut
// ======================================

document.addEventListener("keydown", function (event) {

    if (event.ctrlKey && event.key === "p") {

        event.preventDefault();

        printReport();

    }

});


// ======================================
// Download Button Events
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".report-buttons button");

    if (buttons.length >= 2) {

        buttons[0].addEventListener("click", downloadCSV);

        buttons[1].addEventListener("click", downloadPDF);

    }

});


// ======================================
// Page Loaded
// ======================================

console.log("Reports page loaded successfully.");