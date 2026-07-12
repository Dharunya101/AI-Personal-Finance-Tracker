const email = localStorage.getItem("loggedInUser");

// ======================================
// Load Report Data
// ======================================

fetch(`http://127.0.0.1:8001/reports/${email}`)

.then(response => response.json())

.then(data => {

    console.log(data);

    // Summary Cards

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


    // ===========================
    // Transactions Table
    // ===========================

    const table = document.getElementById("reportTable");

    table.innerHTML = "";

    data.transactions.forEach(transaction => {

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

.catch(error => {

    console.log(error);

    alert("Unable to load report.");

});


// ======================================
// Download CSV
// ======================================

function downloadCSV(){

    const email = localStorage.getItem("loggedInUser");

    window.open(

        `http://127.0.0.1:8001/reports/download/csv/${email}`,

        "_blank"

    );

}


// ======================================
// Download PDF
// ======================================

function downloadPDF(){

    const email = localStorage.getItem("loggedInUser");

    window.open(

        `http://127.0.0.1:8001/reports/download/pdf/${email}`,

        "_blank"

    );

}