fetch("http://127.0.0.1:8001/budgets/")
.then(response => response.json())
.then(data => {

    let table = document.getElementById("budgetTable");

    table.innerHTML = "";

    data.forEach(budget => {

        table.innerHTML += `
        <tr>

            <td>${budget.category}</td>

            <td>${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
}).format(budget.monthly_budget)}</td>

        </tr>
        `;

    });

})
.catch(error => console.log(error));

function addBudget(){

    const budget = {

        category: document.getElementById("category").value,

        monthly_budget: Number(
            document.getElementById("monthly_budget").value
        )

    };

    fetch("http://127.0.0.1:8001/budgets/",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(budget)

    })

    .then(response=>response.json())

    .then(data=>{

        alert("Budget Added Successfully");

        location.reload();

    })

    .catch(error=>console.log(error));

}

// ===============================
// Budget Status
// ===============================

fetch("http://127.0.0.1:8001/budgets/status")
.then(response => response.json())
.then(data => {

    const table = document.getElementById("budgetStatusTable");

    table.innerHTML = "";

    data.forEach(item => {

        const remainingColor =
            item.remaining < 0 ? "red" : "green";

        table.innerHTML += `

        <tr>

            <td>${item.category}</td>

            <td>₹${item.budget.toLocaleString()}</td>

            <td>₹${item.spent.toLocaleString()}</td>

            <td style="color:${remainingColor}; font-weight:bold;">
                ₹${item.remaining.toLocaleString()}
            </td>

        </tr>

        `;

    });

})
.catch(error => console.log(error));
// =======================================
// Budget Alerts
// =======================================

fetch("http://127.0.0.1:8001/budgets/alerts")
.then(response => response.json())
.then(data => {

    const alerts = document.getElementById("budgetAlerts");

    alerts.innerHTML = "";

    if(data.length === 0){

        alerts.innerHTML = `
            <div class="success-box">

                ✅ All budgets are within limits.

            </div>
        `;

        return;

    }

    data.forEach(alert => {

        alerts.innerHTML += `

        <div class="alert-box">

            ⚠ ${alert.category.toUpperCase()} : ${alert.message}

        </div>

        `;

    });

})
.catch(error => console.log(error));