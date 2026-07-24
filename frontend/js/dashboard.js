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

document.getElementById("userName").textContent =
    name.charAt(0).toUpperCase() + name.slice(1);

// ======================================
// Global Variables
// ======================================

let pieChart = null;
let barChart = null;

const monthFilter = document.getElementById("monthFilter");

// ======================================
// Default Month
// ======================================

monthFilter.value = new Date().toISOString().slice(0, 7);

// ======================================
// Events
// ======================================

loadPageData();

monthFilter.addEventListener("change", loadPageData);

// ======================================
// Load Dashboard
// ======================================

function loadPageData() {

    const month = monthFilter.value;

    // ==================================
    // Dashboard Insights
    // ==================================

    fetch(`http://127.0.0.1:8002/insights/${email}?month=${month}`)

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to load insights.");
        }

        return response.json();

    })

    .then(data => {

        // ==================================
        // Summary Cards
        // ==================================

        document.getElementById("income").textContent =
            "₹" + Number(data.total_income || 0).toLocaleString("en-IN");

        document.getElementById("expense").textContent =
            "₹" + Number(data.total_expense || 0).toLocaleString("en-IN");

        document.getElementById("savings").textContent =
            "₹" + Number(data.savings || 0).toLocaleString("en-IN");

        document.getElementById("budget").textContent =
            "₹" +
            Number(
                (data.total_income || 0) -
                (data.total_expense || 0)
            ).toLocaleString("en-IN");

        // ==================================
        // Destroy Old Charts
        // ==================================

        if (pieChart) {
            pieChart.destroy();
        }

        if (barChart) {
            barChart.destroy();
        }

        // ==================================
        // Category Summary
        // ==================================

        const categorySummary =
            data.category_summary || {};

        const labels = Object.keys(categorySummary);

        const values = Object.values(categorySummary);
                // ==================================
        // Pie Chart
        // ==================================

        pieChart = new Chart(

            document.getElementById("pieChart"),

            {

                type: "pie",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data: values,

                            backgroundColor: [

                                "#22D3EE",
                                "#8B5CF6",
                                "#10B981",
                                "#F59E0B",
                                "#EF4444",
                                "#3B82F6",
                                "#14B8A6",
                                "#F97316"

                            ],

                            borderColor: "rgba(255,255,255,.12)",

                            borderWidth: 1,

                            hoverOffset: 20

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: {

                        duration: 1400,

                        easing: "easeOutQuart"

                    },

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "#CBD5E1",

                                padding: 20,

                                usePointStyle: true,

                                pointStyle: "circle",

                                font: {

                                    size: 13,

                                    weight: "600"

                                }

                            }

                        }

                    }

                }

            }

        );

        // ==================================
        // Top Spending Categories
        // ==================================

        const topCategories = Object.entries(categorySummary)

            .sort((a, b) => b[1] - a[1])

            .slice(0, 5);

        // ==================================
        // Bar Chart
        // ==================================

        barChart = new Chart(

            document.getElementById("barChart"),

            {

                type: "bar",

                data: {

                    labels: topCategories.map(item =>

                        item[0].charAt(0).toUpperCase() +
                        item[0].slice(1)

                    ),

                    datasets: [

                        {

                            label: "Amount Spent",

                            data: topCategories.map(item => item[1]),

                            backgroundColor: [

                                "#22D3EE",
                                "#8B5CF6",
                                "#10B981",
                                "#F59E0B",
                                "#EF4444"

                            ],

                            borderRadius: 15,

                            borderSkipped: false,

                            barThickness: 25

                        }

                    ]

                },

                options: {

                    indexAxis: "y",

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: {

                        duration: 1400,

                        easing: "easeOutQuart"

                    },

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

                                color: "rgba(255,255,255,.05)"

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

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to load transactions.");
        }

        return response.json();

    })

    .then(data => {

        data.sort(

            (a, b) => new Date(b.date) - new Date(a.date)

        );

        const table = document.getElementById("transactionTable");

        table.innerHTML = "";

        // ==========================
        // Empty State
        // ==========================

        if (data.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="4"
                        style="
                            text-align:center;
                            padding:30px;
                            color:#94A3B8;
                        ">

                        No transactions found for this month.

                    </td>

                </tr>

            `;

            return;

        }

        // ==========================
        // Build Rows
        // ==========================

        let rows = "";

        data.slice(0, 5).forEach(transaction => {

            rows += `

                <tr>

                    <td>${transaction.date}</td>

                    <td>

                        <span class="category-pill">

                            ${transaction.category}

                        </span>

                    </td>

                    <td>

                        ₹${Number(transaction.amount).toLocaleString("en-IN")}

                    </td>

                    <td>

                        ${transaction.location}

                    </td>

                </tr>

            `;

        });

        table.innerHTML = rows;

    })

    .catch(error => {

        console.error("Transaction Error:", error);

    });

}