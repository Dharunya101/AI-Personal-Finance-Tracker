// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

if (!email) {
    window.location.href = "login.html";
}

// ======================================
// Welcome Message
// ======================================

const name = email.split("@")[0];

document.getElementById("userName").innerHTML =
    name.charAt(0).toUpperCase() + name.slice(1);

// ======================================
// Global Variables
// ======================================

let pieChart = null;
let barChart = null;

const monthFilter = document.getElementById("monthFilter");

// Default = Current Month
monthFilter.value = new Date().toISOString().slice(0, 7);

// Initial Load
loadPageData();

// Reload when month changes
monthFilter.addEventListener("change", loadPageData);

// ======================================
// Load Dashboard
// ======================================

function loadPageData() {

    const month = monthFilter.value;

    // ======================================
    // Dashboard Insights
    // ======================================

    fetch(`http://127.0.0.1:8002/insights/${email}?month=${month}`)

    .then(response => response.json())

    .then(data => {

        // ==========================
        // Summary Cards
        // ==========================

        document.getElementById("income").innerHTML =
            "₹" + Number(data.total_income).toLocaleString();

        document.getElementById("expense").innerHTML =
            "₹" + Number(data.total_expense).toLocaleString();

        document.getElementById("savings").innerHTML =
            "₹" + Number(data.savings).toLocaleString();

        document.getElementById("budget").innerHTML =
            "₹" + Number(
                data.total_income - data.total_expense
            ).toLocaleString();

        // ==========================
        // Expense by Category (Pie)
        // ==========================

        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(

            document.getElementById("pieChart"),

            {

                type: "pie",

                data: {

                    labels: Object.keys(data.category_summary),

                    datasets: [{

                        data: Object.values(data.category_summary),

                        backgroundColor: [

                            "#4FC3F7",
                            "#FF6384",
                            "#FF9F40",
                            "#FFD166",
                            "#4BC0C0",
                            "#9966FF",
                            "#C9CBCF",
                            "#36A2EB"

                        ],

                        borderColor: "#FFFFFF",

                        borderWidth: 2

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "white",

                                font: {

                                    size: 14,

                                    weight: "bold"

                                }

                            }

                        }

                    }

                }

            }

        );

        // ==========================
        // Top 5 Spending Categories
        // ==========================

        const topCategories = Object.entries(data.category_summary)

            .sort((a, b) => b[1] - a[1])

            .slice(0, 5);
                    if (barChart) {
            barChart.destroy();
        }

        barChart = new Chart(

            document.getElementById("barChart"),

            {

                type: "bar",

                data: {

                    labels: topCategories.map(item =>

                        item[0].charAt(0).toUpperCase() +
                        item[0].slice(1)

                    ),

                    datasets: [{

                        label: "Amount Spent",

                        data: topCategories.map(item => item[1]),

                        backgroundColor: [

                            "#36A2EB",
                            "#FF6384",
                            "#FF9F40",
                            "#FFD166",
                            "#4BC0C0"

                        ],

                        borderRadius: 8,

                        borderWidth: 1

                    }]

                },

                options: {

                    indexAxis: "y",

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        x: {

                            beginAtZero: true,

                            ticks: {

                                color: "white",

                                font: {

                                    size: 13,

                                    weight: "bold"

                                }

                            },

                            grid: {

                                color: "rgba(255,255,255,0.15)"

                            }

                        },

                        y: {

                            ticks: {

                                color: "white",

                                font: {

                                    size: 13,

                                    weight: "bold"

                                }

                            },

                            grid: {

                                display: false

                            }

                        }

                    }

                }

            }

        );

    })

    .catch(error => {

        console.error("Insights Error:", error);

    });

    // ======================================
    // Load Recent Transactions
    // ======================================

    fetch(

        `http://127.0.0.1:8002/transactions/user/${email}?month=${month}`

    )

    .then(response => response.json())

    .then(data => {

        data.sort(

            (a, b) => new Date(b.date) - new Date(a.date)

        );

        const table = document.getElementById("transactionTable");

        table.innerHTML = "";

        if(data.length === 0){

            table.innerHTML = `

            <tr>

                <td colspan="4"
                    style="
                        text-align:center;
                        padding:20px;
                        color:white;
                    ">

                    No transactions found for this month.

                </td>

            </tr>

            `;

            return;

        }

        data.slice(0,5).forEach(transaction => {

            table.innerHTML += `

            <tr>

                <td>${transaction.date}</td>

                <td>${transaction.category}</td>

                <td>

                    ₹${Number(transaction.amount).toLocaleString("en-IN")}

                </td>

                <td>${transaction.location}</td>

            </tr>

            `;

        });

    })

    .catch(error => {

        console.error("Transaction Error:", error);

    });

}