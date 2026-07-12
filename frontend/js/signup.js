// ======================================
// Signup Function
// ======================================

function signup() {

    const user = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value,

        confirmPassword: document.getElementById("confirmPassword").value

    };

    // ===============================
    // Check Empty Fields
    // ===============================

    if (
        user.name === "" ||
        user.email === "" ||
        user.password === "" ||
        user.confirmPassword === ""
    ) {

        alert("Please fill in all the fields.");
        return;

    }

    // ===============================
    // Password Validation
    // ===============================

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if (!passwordRegex.test(user.password)) {

        alert(
`Password must contain:

• Minimum 8 characters
• At least one uppercase letter (A-Z)
• At least one lowercase letter (a-z)
• At least one number (0-9)
• At least one special character (@$!%*?&.#)`
        );

        return;

    }

    // ===============================
    // Confirm Password
    // ===============================

    if (user.password !== user.confirmPassword) {

        alert("Passwords do not match.");
        return;

    }

    // ===============================
    // Send Data to Backend
    // ===============================

    fetch("http://127.0.0.1:8001/auth/signup", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("message").innerHTML = data.message;

        if (data.message === "Account created successfully.") {

            alert("Account Created Successfully!");

            setTimeout(() => {

                window.location.href = "login.html";

            }, 500);

        } else {

            alert(data.message);

        }

    })

    .catch(error => {

        console.error(error);

        alert("Signup Failed");

    });

}


// ======================================
// Show / Hide Password
// ======================================

function togglePassword(id, element) {

    const input = document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";
        element.textContent = "🙈";

    } else {

        input.type = "password";
        element.textContent = "👁️";

    }

}