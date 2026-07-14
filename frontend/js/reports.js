// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

// ======================================
// Month Filter
// ======================================

const monthFilter = document.getElementById("monthFilter");

// Default = Current Month
monthFilter.value = new Date().toISOString().slice(0,7);

// Initial Load
loadPageData();

// Reload when month changes
monthFilter.addEventListener("change", loadPageData);


// ======================================
// Load Report
// ======================================

function loadPageData(){

    const month = monthFilter.value;

    fetch(

        `http://127.0.0.1:8001/reports/${email}?month=${month}`

    )

    .then(response => response.json())

    .then(data => {

        // ===========================
        // Summary Cards
        // ===========================

        document.getElementById("income").innerHTML =
            new Intl.NumberFormat("en-IN",{

                style:"currency",

                currency:"INR"

            }).format(data.total_income);

        document.getElementById("expense").innerHTML =
            new Intl.NumberFormat("en-IN",{

                style:"currency",

                currency:"INR"

            }).format(data.total_expense);

        document.getElementById("savings").innerHTML =
            new Intl.NumberFormat("en-IN",{

                style:"currency",

                currency:"INR"

            }).format(data.savings);


        // ===========================
        // Transactions Table
        // ===========================

        const table = document.getElementById("reportTable");

        table.innerHTML = "";

        if(data.transactions.length===0){

            table.innerHTML=`

            <tr>

                <td colspan="4"
                style="text-align:center;
                padding:20px;">

                No transactions found for this month.

                </td>

            </tr>

            `;

            return;

        }

        data.transactions.forEach(transaction=>{

            table.innerHTML += `

            <tr>

                <td>${transaction.date}</td>

                <td>${transaction.category}</td>

                <td>

                ${new Intl.NumberFormat("en-IN",{

                    style:"currency",

                    currency:"INR"

                }).format(transaction.amount)}

                </td>

                <td>${transaction.location}</td>

            </tr>

            `;

        });

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to load report.");

    });

}


// ======================================
// Download CSV
// ======================================

function downloadCSV(){

    window.open(

        `http://127.0.0.1:8001/reports/download/csv/${email}`,

        "_blank"

    );

}


// ======================================
// Download PDF
// ======================================

function downloadPDF(){

    window.open(

        `http://127.0.0.1:8001/reports/download/pdf/${email}`,

        "_blank"

    );

}