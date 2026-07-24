// ======================================
// SIGNUP
// ======================================

function signup() {

    const message = document.getElementById("message");

    message.innerHTML = "";

    message.style.color = "";

    const name = document
        .getElementById("name")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    const button =
        document.getElementById("createAccountBtn");

    const loader =
        document.getElementById("loader");

    // ======================================
    // EMPTY FIELD VALIDATION
    // ======================================

    if (!name || !email || !password || !confirmPassword) {

        message.style.color = "#ff5f7a";

        message.innerHTML =
            "Please fill in all the fields.";

        return;

    }

    // ======================================
    // EMAIL VALIDATION
    // ======================================

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        message.style.color = "#ff5f7a";

        message.innerHTML =
            "Please enter a valid email address.";

        return;

    }

    // ======================================
    // PASSWORD VALIDATION
    // ======================================

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if (!passwordRegex.test(password)) {

        message.style.color = "#ff5f7a";

        message.innerHTML =
            "Password must contain uppercase, lowercase, number and special character.";

        return;

    }

    // ======================================
    // PASSWORD MATCH
    // ======================================

    if (password !== confirmPassword) {

        message.style.color = "#ff5f7a";

        message.innerHTML =
            "Passwords do not match.";

        return;

    }

    // ======================================
    // LOADER
    // ======================================

    loader.style.display = "flex";

    button.disabled = true;

    button.innerHTML =
        "Creating Account...";

    // ======================================
    // API CALL
    // ======================================

    fetch(

        "http://127.0.0.1:8002/auth/signup",

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                name,

                email,

                password,

                confirmPassword

            })

        }

    )

    .then(response => response.json())

    .then(data => {

        if (data.message === "Account created successfully.") {

            message.style.color = "#37d67a";

            message.innerHTML =
                "Account created successfully! Redirecting...";

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);

        }

        else {

            message.style.color = "#ff5f7a";

            message.innerHTML =
                data.message;

            document.getElementById("password").value = "";

            document.getElementById("confirmPassword").value = "";

            document.getElementById("password").focus();

        }

    })

    .catch(error => {

        console.log(error);

        message.style.color = "#ff5f7a";

        message.innerHTML =
            "Unable to connect to server.";

    })

    .finally(() => {

        loader.style.display = "none";

        button.disabled = false;

        button.innerHTML =
            "Create Account";

    });

}

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

function togglePassword(id, element) {

    const input =
        document.getElementById(id);

    const icon =
        element.querySelector("i");

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

// ======================================
// ENTER KEY SUPPORT
// ======================================

document.addEventListener(

    "keydown",

    function (event) {

        if (

            event.key === "Enter" &&

            document.activeElement.tagName !== "TEXTAREA"

        ) {

            event.preventDefault();

            signup();

        }

    }

);

// ======================================
// AUTO FOCUS
// ======================================

window.onload = function () {

    document.getElementById("name").focus();

};