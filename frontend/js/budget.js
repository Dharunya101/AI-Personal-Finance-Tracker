// =====================================
// Logged In User
// =====================================

const email = localStorage.getItem("loggedInUser");

// =====================================
// Currency Formatter
// =====================================

const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
});

// =====================================
// Load Budget Overview
// =====================================

async function loadBudgets() {

    try {

        const response = await fetch("http://127.0.0.1:8002/budgets/");

        const data = await response.json();

        const table = document.getElementById("budgetTable");

        table.innerHTML = "";

        let totalBudget = 0;

        data.forEach(budget => {

            totalBudget += budget.monthly_budget;

            table.innerHTML += `

            <tr>

                <td>${budget.category}</td>

                <td>${formatter.format(budget.monthly_budget)}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="changeBudget('${budget.category}',${budget.monthly_budget})">

                        ✏ Edit

                    </button>

                </td>

            </tr>

            `;

        });

        document.getElementById("totalBudgetCard").innerHTML =
            formatter.format(totalBudget);

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// Add Budget
// =====================================

async function addBudget(){

    const budget={

        category:document.getElementById("category").value,

        monthly_budget:Number(
            document.getElementById("monthly_budget").value
        )

    };

    try{

        const response=await fetch(
            "http://127.0.0.1:8002/budgets/",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(budget)

            }
        );

        const data=await response.json();

        alert(data.message);

        location.reload();

    }

    catch(error){

        console.log(error);

        alert("Unable to add budget.");

    }

}

// =====================================
// Load Budget Status
// =====================================

async function loadBudgetStatus(){

    try{

        const response=await fetch(
            `http://127.0.0.1:8002/budgets/status/${email}`
        );

        const data=await response.json();

        const table=document.getElementById("budgetStatusTable");

        const progress=document.getElementById("budgetProgress");

        table.innerHTML="";

        if(progress){

    progress.innerHTML = "";

}

        let totalSpent=0;

        let totalRemaining=0;
                data.forEach(item=>{

            totalSpent += item.spent;

            totalRemaining += item.remaining;

            let percentage = 0;

            if(item.budget>0){

                percentage = (item.spent/item.budget)*100;

            }

            const displayPercentage = Math.min(percentage,100);

            let status="Healthy";

            let statusClass="status-success";

            if(percentage>=70){

                status="Warning";

                statusClass="status-warning";

            }

            if(percentage>=100){

                status="Exceeded";

                statusClass="status-danger";

            }

            table.innerHTML += `

            <tr>

                <td>${item.category}</td>

                <td>${formatter.format(item.budget)}</td>

                <td>${formatter.format(item.spent)}</td>

                <td>${formatter.format(item.remaining)}</td>

                <td>

                    <span class="${statusClass}">

                        ${status}

                    </span>

                </td>

            </tr>

            `;

            progress.innerHTML += `

            <div class="progress-item">

                <div class="progress-header">

                    <h3>${item.category}</h3>

                    <span>${percentage.toFixed(0)}%</span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${displayPercentage}%">

                    </div>

                </div>

            </div>

            `;

        });

        document.getElementById("totalSpentCard").innerHTML =
            formatter.format(totalSpent);

        document.getElementById("remainingCard").innerHTML =
            formatter.format(totalRemaining);

        const totalBudget =
            totalSpent + totalRemaining;

        let usage = 0;

        if(totalBudget>0){

            usage = (totalSpent/totalBudget)*100;

        }

        document.getElementById("usageCard").innerHTML =
            usage.toFixed(0) + "%";

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// Budget Alerts
// =====================================

async function loadBudgetAlerts(){

    try{

        const response=await fetch(

            `http://127.0.0.1:8002/budgets/alerts/${email}`

        );

        const data=await response.json();

        const alerts=document.getElementById("budgetAlerts");

        alerts.innerHTML="";

        let recommendation="Excellent! Your budgets are well managed this month.";

        if(data.length===0){

            alerts.innerHTML=`

                <div class="alert-card alert-success">

                    ✅ All budgets are within limits.

                </div>

            `;

        }

        else{

            recommendation =
                "Some categories are close to or exceeding their budget. Consider reducing spending in these areas.";

            data.forEach(alert=>{

                alerts.innerHTML += `

                <div class="alert-card alert-warning">

                    ⚠ <strong>${alert.category}</strong><br>

                    ${alert.message}

                </div>

                `;

            });

        }

        document.getElementById("budgetRecommendation").innerHTML =
            recommendation;

    }

    catch(error){

        console.log(error);

    }

}
// =====================================
// Change Budget
// =====================================

async function changeBudget(category,currentBudget){

    const newBudget = prompt(

        `Current Budget: ₹${currentBudget}\n\nEnter New Budget:`,

        currentBudget

    );

    if(newBudget === null){

        return;

    }

    if(newBudget === "" || isNaN(newBudget) || Number(newBudget) <= 0){

        alert("Please enter a valid budget amount.");

        return;

    }

    try{

        const response = await fetch(

            `http://127.0.0.1:8002/budgets/${category}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    category:category,

                    monthly_budget:Number(newBudget)

                })

            }

        );

        const data = await response.json();

        alert(data.message);

        loadBudgets();

        loadBudgetStatus();

        loadBudgetAlerts();

    }

    catch(error){

        console.log(error);

        alert("Unable to update budget.");

    }

}

// =====================================
// Month Filter
// =====================================

const monthFilter = document.getElementById("monthFilter");

if(monthFilter){

    const today = new Date();

    monthFilter.value =
        today.toISOString().slice(0,7);

    monthFilter.addEventListener("change",()=>{

        loadBudgets();

        loadBudgetStatus();

        loadBudgetAlerts();

    });

}

// =====================================
// Initialize Page
// =====================================

async function initializeBudgetPage(){

    await loadBudgets();

    await loadBudgetStatus();

    await loadBudgetAlerts();

}

initializeBudgetPage();