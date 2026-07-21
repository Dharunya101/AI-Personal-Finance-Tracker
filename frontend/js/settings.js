// ======================================
// Protect Page
// ======================================

const email = localStorage.getItem("loggedInUser");

if (!email) {

    window.location.href = "login.html";

}

// ======================================
// Load User Details
// ======================================

fetch(`http://127.0.0.1:8002/users/${email}`)

.then(response => response.json())

.then(data => {

    document.getElementById("name").value = data.name;

    document.getElementById("email").value = data.email;

})

.catch(error => {

    console.log(error);

    alert("Unable to load profile.");

});


// ======================================
// Save Profile
// ======================================

function saveProfile(){

    const user = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value

    };

    fetch("http://127.0.0.1:8002/users/update",{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(user)

    })

    .then(response=>response.json())

    .then(data=>{

        alert(data.message);

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to update profile.");

    });

}


// ======================================
// Change Password
// ======================================

function changePassword(){

    const currentPassword =

        document.getElementById("oldPassword").value;

    const newPassword =

        document.getElementById("newPassword").value;

    if(currentPassword==="" || newPassword===""){

        alert("Please fill all fields.");

        return;

    }

    // Same validation as Signup

    const passwordRegex =

    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if(!passwordRegex.test(newPassword)){

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

    fetch(

        "http://127.0.0.1:8002/users/change-password",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                email:email,

                current_password:currentPassword,

                new_password:newPassword

            })

        }

    )

    .then(response=>response.json())

    .then(data=>{

        alert(data.message);

        document.getElementById("oldPassword").value="";

        document.getElementById("newPassword").value="";

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to update password.");

    });

}


// ======================================
// Show / Hide Password
// ======================================

function togglePassword(id, element){

    const input = document.getElementById(id);

    const icon = element.querySelector("i");

    if(input.type==="password"){

        input.type="text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }

    else{

        input.type="password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}
// ======================================
// Logout
// ======================================

function logout(){

    localStorage.removeItem("loggedInUser");

    window.location.href="login.html";

}