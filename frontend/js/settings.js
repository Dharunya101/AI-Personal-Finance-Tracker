// ======================================
// PROTECT PAGE
// ======================================

const email = localStorage.getItem("loggedInUser");

if (!email) {
    window.location.href = "login.html";
}

// ======================================
// LOAD USER DETAILS
// ======================================

fetch(`http://127.0.0.1:8002/users/${encodeURIComponent(email)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Unable to fetch user.");
        }
        return response.json();
    })
    .then(data => {

        console.log("User Loaded:", data);

        document.getElementById("name").value = data.name || "";
        document.getElementById("email").value = data.email || "";

    })
    .catch(error => {

        console.error(error);
        alert("Unable to load profile.");

    });

// ======================================
// SAVE PROFILE
// ======================================

function saveProfile() {

    const user = {

        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value

    };

    fetch("http://127.0.0.1:8002/users/update", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Update failed");
        }

        return response.json();

    })

    .then(data => {

        alert(data.message || "Profile updated successfully.");

    })

    .catch(error => {

        console.error(error);
        alert("Unable to update profile.");

    });

}

// ======================================
// CHANGE PASSWORD
// ======================================

function changePassword() {

    const currentPassword =
        document.getElementById("oldPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    if (currentPassword === "" || newPassword === "") {

        alert("Please fill all fields.");
        return;

    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if (!passwordRegex.test(newPassword)) {

        alert(
`Password must contain:

• Minimum 8 characters
• One uppercase letter
• One lowercase letter
• One number
• One special character`
        );

        return;

    }

    fetch("http://127.0.0.1:8002/users/change-password", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            email: email,
            current_password: currentPassword,
            new_password: newPassword

        })

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Password change failed.");
        }

        return response.json();

    })

    .then(data => {

        alert(data.message || "Password updated successfully.");

        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";

    })

    .catch(error => {

        console.error(error);
        alert("Unable to update password.");

    });

}

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

function togglePassword(id, element) {

    const input = document.getElementById(id);

    const icon = element.querySelector("i");

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

    }

}

// ======================================
// DARK / LIGHT THEME
// ======================================

const toggle = document.getElementById("themeToggle");

const savedTheme =
localStorage.getItem("theme") || "dark";

document.body.setAttribute(
    "data-theme",
    savedTheme
);

toggle.checked = savedTheme === "light";

toggle.addEventListener("change",function(){

    if(this.checked){

        document.body.setAttribute(
            "data-theme",
            "light"
        );

        localStorage.setItem(
            "theme",
            "light"
        );

    }

    else{

        document.body.setAttribute(
            "data-theme",
            "dark"
        );

        localStorage.setItem(
            "theme",
            "dark"
        );

    }

});

// ======================================
// PREFERENCES
// ======================================

const currency =
    document.getElementById("currency");

const dateFormat =
    document.getElementById("dateFormat");

if (currency) {

    currency.value =
        localStorage.getItem("currency") || "INR";

}

if (dateFormat) {

    dateFormat.value =
        localStorage.getItem("dateFormat") ||
        "DD/MM/YYYY";

}

function savePreferences() {

    localStorage.setItem(
        "currency",
        currency.value
    );

    localStorage.setItem(
        "dateFormat",
        dateFormat.value
    );

    alert("Preferences saved successfully.");

}
// ======================================
// CLEAR ALL TRANSACTIONS
// ======================================

function clearAllTransactions() {

    const confirmDelete = confirm(
        "This will permanently delete all your transactions.\n\nDo you want to continue?"
    );

    if (!confirmDelete) return;

    fetch(
        `http://127.0.0.1:8002/transactions/clear/${encodeURIComponent(email)}`,
        {
            method: "DELETE"
        }
    )

    .then(response => {

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        return response.json();

    })

    .then(data => {

        alert(data.message || "Transactions deleted successfully.");

    })

    .catch(error => {

        console.error(error);
        alert("Unable to clear transactions.");

    });

}

// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";

}

console.log("Settings loaded successfully.");