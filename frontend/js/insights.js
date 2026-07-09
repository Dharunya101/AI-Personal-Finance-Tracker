// ======================================
// Financial Insights
// ======================================

const email = localStorage.getItem("loggedInUser");

fetch(`http://127.0.0.1:8001/insights/${email}`)
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

    new Chart(
        document.getElementById("pieChart"),
        {

            type: "pie",

            data: {

                labels: Object.keys(data.category_summary),

                datasets: [{

                    data: Object.values(data.category_summary)

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }

    );

    // ===========================
    // Bar Chart
    // ===========================

    new Chart(
        document.getElementById("barChart"),
        {

            type: "bar",

            data: {

                labels: Object.keys(data.category_summary),

                datasets: [{

                    label: "Expense",

                    data: Object.values(data.category_summary)

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }

    );

})
.catch(error => console.log(error));