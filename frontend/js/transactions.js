loadTransactions();

function loadTransactions(){

const email = localStorage.getItem("loggedInUser");

fetch(`http://127.0.0.1:8001/transactions/${email}`)

.then(response=>response.json())

.then(data=>{

let table=document.getElementById("transactionTable");

table.innerHTML="";

data.forEach(t=>{

table.innerHTML+=`

<tr>

<td>${t.date}</td>

<td>${t.category}</td>

<td>₹${t.amount}</td>

<td>${t.location}</td>

</tr>

`;

});

});

}

function addTransaction(){

const transaction = {

    user_email: localStorage.getItem("loggedInUser"),

    notes: document.getElementById("notes").value,

    payment_mode: document.getElementById("payment_mode").value,

    location: document.getElementById("location").value,

    amount: Number(document.getElementById("amount").value),

    date: document.getElementById("date").value

};

fetch("http://127.0.0.1:8001/transactions/",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(transaction)

})

.then(response=>response.json())

.then(data=>{

alert(data.message);

location.reload();

});

}