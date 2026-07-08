// Load logged-in user

document.getElementById("email").value =
    localStorage.getItem("loggedInUser") || "";

// Save Profile

function saveProfile(){

    alert("Profile Updated Successfully!");

}

// Change Password

function changePassword(){

    const oldPassword =
        document.getElementById("oldPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    if(oldPassword === "" || newPassword === ""){

        alert("Please fill all fields.");

        return;

    }

    alert("Password Updated Successfully!");

}

// Dark Mode

function toggleTheme(){

    document.body.classList.toggle("dark-mode");

}

// Logout

function logout(){

    localStorage.removeItem("loggedInUser");

    window.location.href="login.html";

}

// Protect Page

if(!localStorage.getItem("loggedInUser")){

    window.location.href="login.html";

}