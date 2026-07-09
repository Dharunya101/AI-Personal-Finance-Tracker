// ==========================================
// Dashboard
// ==========================================

const email = localStorage.getItem("loggedInUser");

console.log("Logged in user:", email);

if (!email) {
    alert("Please login first.");
    window.location.href = "login.html";
}
fetch(`http://127.0.0.1:8001/dashboard/overview/${email}`)
.then(response => response.json())
.then(data => {

    console.log("Overview Data:", data);

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

    document.getElementById("budget").innerHTML =
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(data.budget_remaining);

})
.catch(error => console.error("Overview Error:", error));



// ==========================================
// Recent Transactions
// ==========================================
fetch(`http://127.0.0.1:8001/dashboard/recent-transactions/${email}`)
.then(response => response.json())
.then(data => {

    const table = document.getElementById("transactionTable");

    table.innerHTML = "";

    data.forEach(transaction => {

        table.innerHTML += `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR"
                }).format(transaction.amount)}</td>
                <td>${transaction.location}</td>
            </tr>
        `;

    });

})
.catch(error => console.error("Transaction Error:", error));



// ==========================================
// Expense by Category Pie Chart
// ==========================================
fetch(`http://127.0.0.1:8001/dashboard/category-summary/${email}`)
.then(response => response.json())
.then(data => {

    const labels = Object.keys(data);
    const values = Object.values(data);

    const ctx = document.getElementById("pieChart").getContext("2d");

    new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{

                label: "Expenses",

                data: values

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                },

                title: {
                    display: true,
                    text: "Expense by Category"
                }

            }

        }

    });

})
.catch(error => console.error("Category Chart Error:", error));



// ==========================================
// Monthly Expense Trend
// ==========================================
fetch(`http://127.0.0.1:8001/dashboard/monthly-summary/${email}`)
.then(response => response.json())
.then(data => {

    const labels = Object.keys(data);
    const values = Object.values(data);

    const ctx = document.getElementById("lineChart").getContext("2d");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Monthly Expense",

                data: values,

                fill: false,

                borderWidth: 3,

                tension: 0.3

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                },

                title: {
                    display: true,
                    text: "Monthly Expense Trend"
                }

            }

        }

    });

})
.catch(error => console.error("Monthly Chart Error:", error));