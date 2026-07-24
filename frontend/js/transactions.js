// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

if (!email) {

    window.location.href = "login.html";

}

// ======================================
// Global Variables
// ======================================

let allTransactions = [];

let filteredTransactions = [];

let currentPage = 1;

const rowsPerPage = 5;

// ======================================
// Initial Load
// ======================================

loadTransactions();

// ======================================
// Load Transactions
// ======================================

function loadTransactions() {

    document.getElementById("transactionTable").innerHTML = `

        <tr>

            <td colspan="5"
                style="
                    text-align:center;
                    padding:30px;
                    color:#94A3B8;
                ">

                Loading transactions...

            </td>

        </tr>

    `;

    fetch(`http://127.0.0.1:8002/transactions/user/${email}`)

        .then(response => {

            if (!response.ok) {

                throw new Error("Unable to fetch transactions.");

            }

            return response.json();

        })

        .then(data => {

            allTransactions = Array.isArray(data) ? data : [];

            filteredTransactions = [...allTransactions];

            sortTransactions();

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load transactions.");

        });

}

// ======================================
// Sort Transactions
// ======================================

function sortTransactions() {

    const order = document.getElementById("sortDate").value;

    filteredTransactions.sort((a, b) => {

        const dateA = new Date(a.date);

        const dateB = new Date(b.date);

        return order === "newest"

            ? dateB - dateA

            : dateA - dateB;

    });

    currentPage = 1;

    displayTransactions(filteredTransactions);

}

// ======================================
// Display Transactions
// ======================================

function displayTransactions(data) {

    const table = document.getElementById("transactionTable");

    table.innerHTML = "";

    document.getElementById("transactionCount").textContent =
        `(${data.length})`;

    // ==================================
    // Empty State
    // ==================================

    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#94A3B8;
                    ">

                    No transactions found.

                </td>

            </tr>

        `;

        document.getElementById("pagination").innerHTML = "";

        return;

    }

    // ==================================
    // Pagination
    // ==================================

    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    const pageData = data.slice(start, end);

    let rows = "";

    pageData.forEach(t => {

        rows += `

        <tr>

            <td>

                ${t.date || "-"}

            </td>

            <td>

                <span class="category-pill">

                    ${t.category || "Uncategorized"}

                </span>

            </td>

            <td>

                ₹${Number(t.amount || 0).toLocaleString("en-IN")}

            </td>

            <td>

                ${t.location || "-"}

            </td>

            <td>

                <button

                    class="action-btn edit-btn"

                    title="Edit Transaction"

                    onclick="editTransaction('${t._id}')">

                    ✏️

                </button>

                <button

                    class="action-btn delete-btn"

                    title="Delete Transaction"

                    onclick="deleteTransaction('${t._id}')">

                    🗑️

                </button>

            </td>

        </tr>

        `;

    });

    table.innerHTML = rows;

    renderPagination(data.length);

}

// ======================================
// Pagination
// ======================================

function renderPagination(totalRows) {

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    let html = "";

    html += `

        <button

            ${currentPage === 1 ? "disabled" : ""}

            onclick="changePage(${currentPage - 1})">

            ◀

        </button>

    `;

    for (let i = 1; i <= totalPages; i++) {

        html += `

            <button

                class="${i === currentPage ? "active" : ""}"

                onclick="changePage(${i})">

                ${i}

            </button>

        `;

    }

    html += `

        <button

            ${currentPage === totalPages ? "disabled" : ""}

            onclick="changePage(${currentPage + 1})">

            ▶

        </button>

    `;

    document.getElementById("pagination").innerHTML = html;

}

function changePage(page) {

    currentPage = page;

    displayTransactions(filteredTransactions);

}
// ======================================
// Search Transactions
// ======================================

const searchBox = document.getElementById("searchTransaction");

if (searchBox) {

    searchBox.addEventListener("input", function () {

        const keyword = this.value.trim().toLowerCase();

        filteredTransactions = allTransactions.filter(t => {

            const category = (t.category || "").toLowerCase();

            const notes = (t.notes || "").toLowerCase();

            const location = (t.location || "").toLowerCase();

            return (

                category.includes(keyword) ||

                notes.includes(keyword) ||

                location.includes(keyword)

            );

        });

        currentPage = 1;

        sortTransactions();

    });

}

// ======================================
// Add Transaction
// ======================================

function addTransaction() {

    const notes =
        document.getElementById("notes").value.trim();

    const payment_mode =
        document.getElementById("payment_mode").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const date =
        document.getElementById("date").value;

    // ==========================
    // Validation
    // ==========================

    if (

        notes === "" ||

        payment_mode === "" ||

        location === "" ||

        !amount ||

        date === ""

    ) {

        alert("Please fill all fields.");

        return;

    }

    const transaction = {

        user_email: email,

        notes,

        payment_mode,

        location,

        amount,

        date

    };

    // ==========================
    // Save Transaction
    // ==========================

    fetch(

        "http://127.0.0.1:8002/transactions/",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(transaction)

        }

    )

    .then(response => {

        if (!response.ok) {

            throw new Error("Unable to save transaction.");

        }

        return response.json();

    })

    .then(data => {

        alert(data.message);

        // ==========================
        // Clear Form
        // ==========================

        document.getElementById("notes").value = "";

        document.getElementById("payment_mode").value = "";

        document.getElementById("location").value = "";

        document.getElementById("amount").value = "";

        document.getElementById("date").value = "";

        // ==========================
        // Reload Table
        // ==========================

        loadTransactions();

    })

    .catch(error => {

        console.error(error);

        alert("Unable to add transaction.");

    });

}
// ======================================
// Edit Transaction
// ======================================

function editTransaction(id) {

    const transaction = allTransactions.find(t => t._id === id);

    if (!transaction) {

        alert("Transaction not found.");

        return;

    }

    document.getElementById("editId").value = transaction._id;

    document.getElementById("editNotes").value =
        transaction.notes || "";

    document.getElementById("editPaymentMode").value =
        transaction.payment_mode || "";

    document.getElementById("editLocation").value =
        transaction.location || "";

    document.getElementById("editAmount").value =
        transaction.amount || "";

    document.getElementById("editDate").value =
        transaction.date || "";

    document.getElementById("editModal").style.display = "flex";

}

// ======================================
// Close Modal
// ======================================

function closeModal() {

    document.getElementById("editModal").style.display = "none";

}

// ======================================
// Save Transaction
// ======================================

async function saveTransaction() {

    const id = document.getElementById("editId").value;

    const updatedTransaction = {

        notes: document.getElementById("editNotes").value.trim(),

        payment_mode: document.getElementById("editPaymentMode").value.trim(),

        location: document.getElementById("editLocation").value.trim(),

        amount: Number(document.getElementById("editAmount").value),

        date: document.getElementById("editDate").value

    };

    // ==========================
    // Validation
    // ==========================

    if (

        updatedTransaction.notes === "" ||

        updatedTransaction.payment_mode === "" ||

        updatedTransaction.location === "" ||

        !updatedTransaction.amount ||

        updatedTransaction.date === ""

    ) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await fetch(

            `http://127.0.0.1:8002/transactions/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(updatedTransaction)

            }

        );

        if (!response.ok) {

            throw new Error("Unable to update transaction.");

        }

        const result = await response.json();

        alert(result.message);

        closeModal();

        loadTransactions();

    }

    catch (error) {

        console.error(error);

        alert("Unable to update transaction.");

    }

}

// ======================================
// Delete Transaction
// ======================================

async function deleteTransaction(id) {

    const confirmDelete = confirm(

        "Are you sure you want to delete this transaction?"

    );

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await fetch(

            `http://127.0.0.1:8002/transactions/${id}`,

            {

                method: "DELETE"

            }

        );

        if (!response.ok) {

            throw new Error("Unable to delete transaction.");

        }

        const result = await response.json();

        alert(result.message);

        loadTransactions();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete transaction.");

    }

}

// ======================================
// Close Modal on Outside Click
// ======================================

window.onclick = function (event) {

    const modal = document.getElementById("editModal");

    if (event.target === modal) {

        closeModal();

    }

};