// ======================================
// Signup Function
// ======================================

function signup() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ===============================
    // Empty Field Validation
    // ===============================

    if (!name || !email || !password || !confirmPassword) {

        alert("Please fill in all the fields.");

        return;

    }

    // ===============================
    // Email Validation
    // ===============================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        alert("Please enter a valid email address.");

        return;

    }

    // ===============================
    // Password Validation
    // ===============================

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if (!passwordRegex.test(password)) {

        alert(
`Password must contain:

• Minimum 8 characters
• One uppercase letter (A-Z)
• One lowercase letter (a-z)
• One number (0-9)
• One special character (@$!%*?&.#)`
        );

        return;

    }

    // ===============================
    // Confirm Password
    // ===============================

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    // ===============================
    // Disable Button
    // ===============================

    const button = document.querySelector("button");

    button.disabled = true;

    button.innerHTML = "Creating Account...";

    // ===============================
    // Backend Request
    // ===============================

    fetch("http://127.0.0.1:8001/auth/signup", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name,

            email,

            password,

            confirmPassword

        })

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("message").innerHTML = data.message;

        if (data.message === "Account created successfully.") {

            alert("Account created successfully!");

            window.location.href = "login.html";

        }

        else {

            alert(data.message);

            document.getElementById("password").value = "";

            document.getElementById("confirmPassword").value = "";

        }

    })

    .catch(error => {

        console.error(error);

        alert("Unable to create account. Please try again.");

    })

    .finally(() => {

        button.disabled = false;

        button.innerHTML = "Create Account";

    });

}



// ======================================
// Show / Hide Password
// ======================================

function togglePassword(id, element) {

    const input = document.getElementById(id);

    const icon = element.querySelector("i");

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }

    else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}