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
    name.charAt(0).toUpperCase() +
    name.slice(1);


// ======================================
// Global Variables
// ======================================

let pieChart = null;

let barChart = null;

const monthFilter =
    document.getElementById("monthFilter");


// ======================================
// Default Month
// ======================================

monthFilter.value =
    new Date().toISOString().slice(0, 7);


// ======================================
// Events
// ======================================

loadPageData();

monthFilter.addEventListener(

    "change",

    loadPageData

);


// ======================================
// Animated Counter
// ======================================

function animateValue(id, endValue) {

    const element = document.getElementById(id);

    const duration = 1200;

    const startValue = 0;

    const startTime = performance.now();

    function update(currentTime) {

        const progress = Math.min(

            (currentTime - startTime) / duration,

            1

        );

        const currentValue = Math.floor(

            startValue +

            (endValue - startValue) * progress

        );

        element.textContent =
            "₹" +
            currentValue.toLocaleString("en-IN");

        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

}


// ======================================
// Animate Table Rows
// ======================================

function animateTableRows(tableBody) {

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, index) => {

        row.style.opacity = "0";

        row.style.transform = "translateY(25px)";

        row.style.transition =
            "all .5s ease";

        setTimeout(() => {

            row.style.opacity = "1";

            row.style.transform =
                "translateY(0)";

        }, index * 120);

    });

}


// ======================================
// Destroy Existing Charts
// ======================================

function destroyCharts() {

    if (pieChart) {

        pieChart.destroy();

        pieChart = null;

    }

    if (barChart) {

        barChart.destroy();

        barChart = null;

    }

}
// ======================================
// Load Dashboard
// ======================================

function loadPageData() {

    const month = monthFilter.value;
        // ==================================
    // Dashboard Insights
    // ==================================

    fetch(

        `http://127.0.0.1:8002/insights/${email}?month=${month}`

    )

    .then(response => {

        if (!response.ok) {

            throw new Error("Failed to load dashboard insights.");

        }

        return response.json();

    })

    .then(data => {

        // ==================================
        // Animated KPI Cards
        // ==================================

        animateValue(

            "income",

            Number(data.total_income || 0)

        );

        animateValue(

            "expense",

            Number(data.total_expense || 0)

        );

        animateValue(

            "savings",

            Number(data.savings || 0)

        );

        animateValue(

            "budget",

            Number(data.total_income || 0) -

            Number(data.total_expense || 0)

        );

        // ==================================
        // Refresh Charts
        // ==================================

        destroyCharts();

        // ==================================
        // Category Summary
        // ==================================

        const categorySummary =

            data.category_summary || {};

        const labels =

            Object.keys(categorySummary);

        const values =

            Object.values(categorySummary);

        // ==================================
        // Top Spending Categories
        // ==================================

        const topCategories =

            Object.entries(categorySummary)

            .sort(

                (a, b) => b[1] - a[1]

            )

            .slice(0, 5);

        // ==================================
        // Pie Chart
        // ==================================
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

                            borderColor: "rgba(255,255,255,.08)",

                            borderWidth: 2,

                            hoverBorderWidth: 3,

                            hoverOffset: 28

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: {

                        animateRotate: true,

                        animateScale: true,

                        duration: 1800,

                        easing: "easeOutExpo"

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

                        },

                        tooltip: {

                            backgroundColor: "#111827",

                            titleColor: "#ffffff",

                            bodyColor: "#CBD5E1",

                            cornerRadius: 12,

                            padding: 12

                        }

                    }

                }

            }

        );



        // ==================================
        // Bar Chart
        // ==================================

        barChart = new Chart(

            document.getElementById("barChart"),

            {

                type: "bar",

                data: {

                    labels: topCategories.map(category =>

                        category[0].charAt(0).toUpperCase() +

                        category[0].slice(1)

                    ),

                    datasets: [

                        {

                            label: "Amount Spent",

                            data: topCategories.map(category =>

                                category[1]

                            ),

                            backgroundColor: [

                                "#22D3EE",
                                "#8B5CF6",
                                "#10B981",
                                "#F59E0B",
                                "#EF4444"

                            ],

                            borderRadius: 18,

                            borderSkipped: false,

                            barThickness: 24,

                            hoverBackgroundColor: [

                                "#67E8F9",
                                "#A78BFA",
                                "#34D399",
                                "#FBBF24",
                                "#F87171"

                            ]

                        }

                    ]

                },

                options: {

                    indexAxis: "y",

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: {

                        duration: 1800,

                        easing: "easeOutExpo",

                        delay(context) {

                            return context.dataIndex * 150;

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            backgroundColor: "#111827",

                            titleColor: "#ffffff",

                            bodyColor: "#CBD5E1",

                            cornerRadius: 12,

                            padding: 12

                        }

                    },

                    scales: {

                        x: {

                            beginAtZero: true,

                            ticks: {

                                color: "#E2E8F0",

                                font: {

                                    size: 13,

                                    weight: "600"

                                }

                            },

                            grid: {

                                color: "rgba(255,255,255,.05)"

                            }

                        },

                        y: {

                            ticks: {

                                color: "#E2E8F0",

                                font: {

                                    size: 13,

                                    weight: "600"

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

            (a, b) =>

                new Date(b.date) -

                new Date(a.date)

        );

        const table =

            document.getElementById("transactionTable");

        table.innerHTML = "";

        // ==================================
        // Empty State
        // ==================================

        if (data.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="4"
                        style="
                            text-align:center;
                            padding:35px;
                            color:#94A3B8;
                            font-weight:500;
                        ">

                        No transactions found for this month.

                    </td>

                </tr>

            `;

            return;

        }

        // ==================================
        // Recent Transactions
        // ==================================

        data

            .slice(0, 5)

            .forEach(transaction => {

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td>

                        ${transaction.date}

                    </td>

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

                `;

                table.appendChild(row);

            });

        // ==================================
        // Animate Table Rows
        // ==================================

        animateTableRows(table);

    })

    .catch(error => {

        console.error(

            "Transaction Error:",

            error

        );

    });

}