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
// Load Dashboard Insights
// ======================================

fetch(`http://127.0.0.1:8001/insights/${email}`)
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
        "₹" + Number(data.total_income - data.total_expense).toLocaleString();


    // ==========================
    // Expense by Category (Pie Chart)
    // ==========================

    new Chart(document.getElementById("pieChart"), {

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

    });


    // ==========================
    // Monthly Expense Trend
    // ==========================

    if (data.monthly_summary &&
        Object.keys(data.monthly_summary).length > 0) {

        new Chart(document.getElementById("lineChart"), {

            type: "line",

            data: {

                labels: Object.keys(data.monthly_summary),

                datasets: [{

                    label: "Monthly Expense",

                    data: Object.values(data.monthly_summary),

                    borderColor: "#00E5FF",

                    backgroundColor: "rgba(0,229,255,0.25)",

                    pointBackgroundColor: "#00E5FF",

                    pointBorderColor: "#FFFFFF",

                    pointRadius: 5,

                    pointHoverRadius: 8,

                    borderWidth: 4,

                    fill: true,

                    tension: 0.4

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

                },

                scales: {

                    x: {

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

                            color: "rgba(255,255,255,0.15)"

                        }

                    }

                }

            }

        });

    }

})
.catch(error => {

    console.error("Insights Error:", error);

});


// ======================================
// Load Recent Transactions
// ======================================

fetch(`http://127.0.0.1:8001/transactions/user/${email}`)

.then(response => response.json())

.then(data => {

    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    const table = document.getElementById("transactionTable");

    table.innerHTML = "";

    data.slice(0, 5).forEach(transaction => {

        table.innerHTML += `

        <tr>

            <td>${transaction.date}</td>

            <td>${transaction.category}</td>

            <td>₹${Number(transaction.amount).toLocaleString()}</td>

            <td>${transaction.location}</td>

        </tr>

        `;

    });

})

.catch(error => {

    console.error("Transaction Error:", error);

});