function signup() {

    const user = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value,

        confirmPassword: document.getElementById("confirmPassword").value

    };

    if(user.password !== user.confirmPassword){

        alert("Passwords do not match.");

        return;

    }

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

        if(data.message === "Account created successfully."){

            alert("Account Created Successfully!");

            setTimeout(() => {

                window.location.href = "login.html";

            }, 500);

        }
        else{

            alert(data.message);

        }

    })

    .catch(error => {

        console.error(error);

        alert("Signup Failed");

    });

}