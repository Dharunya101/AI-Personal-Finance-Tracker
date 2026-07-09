// ======================================
// Load Transactions
// ======================================

loadTransactions();

function loadTransactions() {

    const email = localStorage.getItem("loggedInUser");
    fetch(`http://127.0.0.1:8001/transactions/user/${email}`)
    .then(response => response.json())

    .then(data => {

        let table = document.getElementById("transactionTable");

        table.innerHTML = "";

        // Show total number of transactions
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

    })

    .catch(error => {

        console.log(error);

        alert("Unable to load transactions.");

    });

}


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
// Placeholder Functions
// ======================================

function editTransaction(id){

    alert("Edit feature coming soon.");

}

function deleteTransaction(id){

    alert("Delete feature coming soon.");

}