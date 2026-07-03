fetch("http://127.0.0.1:8001/reports/")
.then(response => response.json())
.then(data => {

    // Cards
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

    // Transactions
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

    // Pie Chart
    new Chart(document.getElementById("pieChart"), {

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

    });

})
.catch(error => console.log(error));

function downloadCSV(){

    window.open(
        "http://127.0.0.1:8001/reports/download/csv",
        "_blank"
    );

}

function downloadPDF(){

    window.open(
        "http://127.0.0.1:8001/reports/download/pdf",
        "_blank"
    );

}