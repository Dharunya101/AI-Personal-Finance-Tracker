// ======================================
// Financial Insights
// ======================================

const email = localStorage.getItem("loggedInUser");

fetch(`http://127.0.0.1:8002/insights/${email}`)
.then(response => response.json())
.then(data => {

    // ===========================
    // Cards
    // ===========================

    document.getElementById("income").innerHTML =
        "₹" + data.total_income.toLocaleString();

    document.getElementById("expense").innerHTML =
        "₹" + data.total_expense.toLocaleString();

    document.getElementById("savings").innerHTML =
        "₹" + data.savings.toLocaleString();

    document.getElementById("highest").innerHTML =
        data.highest_category;

    // ===========================
    // Summary Table
    // ===========================

    document.getElementById("transactions").innerHTML =
        data.total_transactions;

    document.getElementById("highestCategory").innerHTML =
        data.highest_category;

    // ===========================
    // Pie Chart
    // ===========================
    new Chart(document.getElementById("pieChart"), {

    type: "pie",

    data: {

        labels: Object.keys(data.category_summary),

        datasets: [{

            data: Object.values(data.category_summary),

            backgroundColor: [

                "#36A2EB",
                "#FF6384",
                "#FF9F40",
                "#FFD166",
                "#4BC0C0",
                "#9966FF",
                "#C9CBCF",
                "#3FA9F5"

            ],

            borderColor: "#ffffff",

            borderWidth: 2

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "top",

                labels: {

                    color: "#ffffff",

                    font: {

                        size: 18,

                        weight: "bold"

                    }

                }

            }

        }

    }

});


    // ===========================
    // Bar Chart
    // ===========================
    new Chart(document.getElementById("barChart"), {

    type: "line",

    data: {

        labels: Object.keys(data.category_summary),

        datasets: [{

            label: "Expense",

            data: Object.values(data.category_summary),

            borderColor: "#18E3FF",

            backgroundColor: "rgba(24,227,255,0.25)",

            fill: true,

            tension: 0.4,

            borderWidth: 5,

            pointRadius: 6,

            pointBackgroundColor: "#ffffff",

            pointBorderColor: "#18E3FF",

            pointBorderWidth: 4

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {

                    color: "#ffffff",

                    font: {

                        size: 18,

                        weight: "bold"

                    }

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    color: "#ffffff",

                    font: {

                        size: 15,

                        weight: "bold"

                    }

                },

                grid: {

                    color: "rgba(255,255,255,0.15)"

                }

            },

            y: {

                ticks: {

                    color: "#ffffff",

                    font: {

                        size: 15,

                        weight: "bold"

                    }

                },

                grid: {

                    color: "rgba(255,255,255,0.15)"

                }

            }

        }

    }

})
})
.catch(error => {

    console.error(error);

    alert("Unable to load insights.");

});