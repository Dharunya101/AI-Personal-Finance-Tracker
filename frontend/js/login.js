function login() {

    // Clear previous message
    document.getElementById("loginMessage").innerHTML = "";

    const user = {

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value.trim()

    };

    // Validation
    if (user.email === "" || user.password === "") {

        document.getElementById("loginMessage").style.color = "red";
        document.getElementById("loginMessage").innerHTML =
            "Please enter Email and Password.";

        return;
    }

    fetch("http://127.0.0.1:8001/auth/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })

    .then(response => response.json())

    .then(data => {

        if (data.message === "Login successful.") {

            // Save logged-in user
            localStorage.setItem("loggedInUser", user.email);

            document.getElementById("loginMessage").style.color = "green";
            document.getElementById("loginMessage").innerHTML =
                "Login Successful! Redirecting...";

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1000);

        }

        else if (data.message === "Incorrect password.") {

            document.getElementById("loginMessage").style.color = "red";
            document.getElementById("loginMessage").innerHTML =
                "❌ Incorrect Password.";

        }

        else if (data.message === "Email not registered.") {

            document.getElementById("loginMessage").style.color = "red";
            document.getElementById("loginMessage").innerHTML =
                "❌ Email not registered.";

        }

        else {

            document.getElementById("loginMessage").style.color = "red";
            document.getElementById("loginMessage").innerHTML =
                data.message;

        }

    })

    .catch(error => {

        console.error(error);

        document.getElementById("loginMessage").style.color = "red";
        document.getElementById("loginMessage").innerHTML =
            "❌ Unable to connect to the server.";

    });

}