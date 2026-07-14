// ======================================
// Global Variables
// ======================================

let allTransactions = [];

// ======================================
// Load Transactions
// ======================================

loadTransactions();

function loadTransactions() {

    const email = localStorage.getItem("loggedInUser");

    fetch(`http://127.0.0.1:8001/transactions/user/${email}`)

    .then(response => response.json())

    .then(data => {

        allTransactions = data;

        sortTransactions();

    })

    .catch(error => {

        console.log(error);

        alert("Unable to load transactions.");

    });

}


// ======================================
// Sort Transactions
// ======================================

function sortTransactions() {

    const order = document.getElementById("sortDate").value;

    if (order === "newest") {

        allTransactions.sort(

            (a, b) => new Date(b.date) - new Date(a.date)

        );

    }

    else {

        allTransactions.sort(

            (a, b) => new Date(a.date) - new Date(b.date)

        );

    }

    displayTransactions(allTransactions);

}


// ======================================
// Display Transactions
// ======================================

function displayTransactions(data) {

    const table = document.getElementById("transactionTable");

    table.innerHTML = "";

    document.getElementById("transactionCount").innerHTML =
        `(${data.length})`;

    data.forEach(t => {

        table.innerHTML += `

        <tr>

            <td>${t.date}</td>

            <td>${t.category}</td>

            <td>₹${Number(t.amount).toLocaleString("en-IN")}</td>

            <td>${t.location}</td>

            <td>

                <button onclick="editTransaction('${t._id}')">

                    Edit

                </button>

                <button onclick="deleteTransaction('${t._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}


// ======================================
// Search Transactions
// ======================================

document.getElementById("searchTransaction")

.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const filtered = allTransactions.filter(t =>

        t.category.toLowerCase().includes(keyword)

        ||

        t.location.toLowerCase().includes(keyword)

    );

    displayTransactions(filtered);

});


// ======================================
// Add Transaction
// ======================================

function addTransaction() {

    const transaction = {

        user_email: localStorage.getItem("loggedInUser"),

        notes: document.getElementById("notes").value,

        payment_mode: document.getElementById("payment_mode").value,

        location: document.getElementById("location").value,

        amount: Number(document.getElementById("amount").value),

        date: document.getElementById("date").value

    };

    fetch("http://127.0.0.1:8001/transactions/", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(transaction)

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        loadTransactions();

        document.getElementById("notes").value = "";
        document.getElementById("payment_mode").value = "";
        document.getElementById("location").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";

    })

    .catch(error => {

        console.log(error);

        alert("Unable to add transaction.");

    });

}


// ======================================
// Edit Transaction
// ======================================

async function editTransaction(id) {

    const amount = prompt("Enter new amount");

    if (amount === null) return;

    const response = await fetch(

        `http://127.0.0.1:8001/transactions/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                amount: Number(amount)

            })

        }

    );

    const result = await response.json();

    alert(result.message);

    loadTransactions();

}


// ======================================
// Delete Transaction
// ======================================

async function deleteTransaction(id) {

    const confirmDelete = confirm(

        "Delete this transaction?"

    );

    if (!confirmDelete) return;

    const response = await fetch(

        `http://127.0.0.1:8001/transactions/${id}`,

        {

            method: "DELETE"

        }

    );

    const result = await response.json();

    alert(result.message);

    loadTransactions();

}