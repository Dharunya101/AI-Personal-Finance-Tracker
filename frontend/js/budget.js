const email = localStorage.getItem("loggedInUser");

// =====================================
// Existing Budgets
// =====================================

fetch("http://127.0.0.1:8002/budgets/")
.then(response => response.json())
.then(data => {

    const table = document.getElementById("budgetTable");

    table.innerHTML = "";

    data.forEach(budget => {

        table.innerHTML += `

        <tr>

            <td>${budget.category}</td>

            <td>${new Intl.NumberFormat("en-IN",{
                style:"currency",
                currency:"INR"
            }).format(budget.monthly_budget)}</td>

            <td>

                <button onclick="changeBudget('${budget.category}', ${budget.monthly_budget})">

                    ✏️ Change

                </button>

            </td>

        </tr>

        `;

    });

})

.catch(error=>console.log(error));


// =====================================
// Add Budget
// =====================================

function addBudget(){

    const budget={

        category:document.getElementById("category").value,

        monthly_budget:Number(

            document.getElementById("monthly_budget").value

        )

    };

    fetch("http://127.0.0.1:8002/budgets/",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(budget)

    })

    .then(response=>response.json())

    .then(data=>{

        alert(data.message);

        location.reload();

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to add budget.");

    });

}


// =====================================
// Budget Status
// =====================================

fetch(`http://127.0.0.1:8002/budgets/status/${email}`)

.then(response=>response.json())

.then(data=>{

    const table=document.getElementById("budgetStatusTable");

    table.innerHTML="";

    data.forEach(item=>{

        const remainingColor=item.remaining<0 ? "red":"limegreen";

        let percentage=(item.spent/item.budget)*100;

        if(isNaN(percentage))
            percentage=0;

        if(percentage>100)
            percentage=100;

        let barColor="#2ecc71";

        if(percentage>=70)
            barColor="#f39c12";

        if(percentage>=90)
            barColor="#e74c3c";

        table.innerHTML+=`

        <tr>

            <td>${item.category}</td>

            <td>₹${item.budget.toLocaleString()}</td>

            <td>₹${item.spent.toLocaleString()}</td>

            <td style="color:${remainingColor};font-weight:bold;">

                ₹${item.remaining.toLocaleString()}

            </td>

            <td>

                <div class="progress-container">

                    <div
                        class="progress-bar"
                        style="
                            width:${percentage}%;
                            background:${barColor};
                        ">

                    </div>

                </div>

                <div class="progress-text">

                    ${percentage.toFixed(0)}%

                </div>

            </td>

        </tr>

        `;

    });

})

.catch(error=>console.log(error));


// =====================================
// Budget Alerts
// =====================================

fetch(`http://127.0.0.1:8002/budgets/alerts/${email}`)

.then(response=>response.json())

.then(data=>{

    const alerts=document.getElementById("budgetAlerts");

    alerts.innerHTML="";

    if(data.length===0){

        alerts.innerHTML=`

        <div class="success-box">

            ✅ All budgets are within limits.

        </div>

        `;

        return;

    }

    data.forEach(alert=>{

        alerts.innerHTML+=`

        <div class="alert-box">

            ⚠ ${alert.category.toUpperCase()} : ${alert.message}

        </div>

        `;

    });

})

.catch(error=>console.log(error));


// =====================================
// Change Budget
// =====================================

function changeBudget(category,currentBudget){

    const newBudget=prompt(

        `Current Budget: ₹${currentBudget}\n\nEnter New Budget:`,

        currentBudget

    );

    if(newBudget===null)
        return;

    if(newBudget==="" || isNaN(newBudget) || Number(newBudget)<=0){

        alert("Please enter a valid budget amount.");

        return;

    }

    fetch(`http://127.0.0.1:8002/budgets/${category}`,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            category:category,

            monthly_budget:Number(newBudget)

        })

    })

    .then(response=>response.json())

    .then(data=>{

        alert(data.message);

        location.reload();

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to update budget.");

    });

}