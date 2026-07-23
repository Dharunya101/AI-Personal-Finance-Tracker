// ======================================
// CUSTOM CAPTCHA
// ======================================

let generatedCaptcha = "";

function generateCaptcha(){

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    generatedCaptcha = "";

    for(let i=0;i<5;i++){

        generatedCaptcha +=
            chars.charAt(
                Math.floor(Math.random()*chars.length)
            );

    }

    document.getElementById("captchaText").innerHTML =
        generatedCaptcha;

}

// ======================================// 
// LOGIN
// ======================================

function login() {

    document.getElementById("loginMessage").innerHTML = "";

    const user = {

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value.trim()

    };

    if(user.email === "" || user.password === ""){

        document.getElementById("loginMessage").style.color = "red";

        document.getElementById("loginMessage").innerHTML =
            "Please enter Email and Password.";

        return;

    }
    const captcha = grecaptcha.getResponse();

if(captcha.length === 0){

    document.getElementById("loginMessage").style.color = "red";

    document.getElementById("loginMessage").innerHTML =
        "Please complete the reCAPTCHA.";

    return;

}
const enteredCaptcha =
document.getElementById("captchaInput")
.value
.trim()
.toUpperCase();

if(enteredCaptcha !== generatedCaptcha){

    document.getElementById("loginMessage").style.color = "red";

    document.getElementById("loginMessage").innerHTML =
        "Incorrect security code.";

    document.getElementById("captchaInput").value = "";

    generateCaptcha();

    return;

}

    fetch(

        "http://127.0.0.1:8002/auth/login",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

    email:user.email,

    password:user.password,

    captcha:grecaptcha.getResponse()

})

        }

    )

    .then(response=>response.json())

    .then(data=>{

        if(data.message==="Login successful."){

            localStorage.setItem(

                "loggedInUser",

                user.email

            );
            document.getElementById("captchaInput").value = "";

generateCaptcha();

grecaptcha.reset();

            document.getElementById("loginMessage").style.color="green";

            document.getElementById("loginMessage").innerHTML=
                "Login Successful! Redirecting...";

            setTimeout(() => {

    console.log("Redirecting...");
    window.location.href = "dashboard.html";
}, 1000);

        }

        else{

    document.getElementById("loginMessage").style.color = "red";

    document.getElementById("loginMessage").innerHTML =
        data.message;

    document.getElementById("captchaInput").value = "";

    generateCaptcha();

    grecaptcha.reset();

}

    })

    .catch(error=>{

        console.log(error);

        document.getElementById("loginMessage").style.color="red";

        document.getElementById("loginMessage").innerHTML=
            "Unable to connect to server.";

    });

}
// ======================================
// Global Variables
// ======================================

let otpTimer;

let enteredEmail = "";

let verifiedOTP = "";

// ======================================
// Forgot Password
// ======================================

function forgotPassword(){

    enteredEmail = document.getElementById("email").value.trim();

    if(enteredEmail===""){

        alert("Please enter your registered email first.");

        return;

    }

    fetch(

        `http://127.0.0.1:8002/auth/forgot-password/${enteredEmail}`,

        {

            method:"POST"

        }

    )

    .then(response=>response.json())

    .then(data=>{

        if(data.message==="OTP sent successfully."){

            alert("OTP has been sent to your email.");

            document.getElementById("otpModal").style.display="flex";

            startTimer();

        }

        else{

            alert(data.message);

        }

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to send OTP.");

    });

}


// ======================================
// OTP Countdown Timer
// ======================================

function startTimer(){

    clearInterval(otpTimer);

    let timeLeft = 300;

    updateTimer(timeLeft);

    otpTimer = setInterval(()=>{

        timeLeft--;

        updateTimer(timeLeft);

        if(timeLeft<=0){

            clearInterval(otpTimer);

            alert("OTP expired.");

            closeOTPModal();

        }

    },1000);

}

function updateTimer(seconds){

    const minutes = Math.floor(seconds/60);

    const secs = seconds%60;

    document.getElementById("timer").innerHTML =

        `OTP expires in <b>${
            String(minutes).padStart(2,"0")
        }:${String(secs).padStart(2,"0")}</b>`;

}


// ======================================
// Show / Hide Password
// ======================================

function togglePassword(id,element){

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
// Close OTP Modal
// ======================================

function closeOTPModal(){

    document.getElementById("otpModal").style.display="none";

    clearInterval(otpTimer);

    document.getElementById("otp").value="";

}
// ======================================
// Verify OTP
// ======================================

function verifyOTP(){

    const otp = document.getElementById("otp").value.trim();
    verifiedOTP = otp;

    if(otp===""){

        alert("Please enter the OTP.");

        return;

    }

    fetch(

        `http://127.0.0.1:8002/auth/verify-otp/${enteredEmail}/${otp}`,

        {

            method:"POST"

        }

    )

    .then(response=>response.json())

    .then(data=>{

        if(data.message==="OTP verified."){

            clearInterval(otpTimer);

            closeOTPModal();

            document.getElementById("resetModal").style.display="flex";

        }

        else{

            alert(data.message);

        }

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to verify OTP.");

    });

}


// ======================================
// Reset Password
// ======================================

// ======================================
// Reset Password
// ======================================

function resetPassword(){

    const otp = verifiedOTP;

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

    if(newPassword==="" || confirmPassword===""){

        alert("Please fill all fields.");

        return;

    }

    // Password Validation

    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if(!passwordRegex.test(newPassword)){

        alert(`Password must contain:

• Minimum 8 characters
• At least one uppercase letter
• At least one lowercase letter
• At least one number
• At least one special character`);

        return;

    }

    if(newPassword!==confirmPassword){

        alert("Passwords do not match.");

        return;

    }

    const url =
    `http://127.0.0.1:8002/auth/reset-password/${encodeURIComponent(enteredEmail)}/${otp}/${encodeURIComponent(newPassword)}`;

    console.log("Reset URL:", url);

    fetch(url,{

        method:"POST"

    })

    .then(response=>response.json())

    .then(data=>{

        console.log("Backend Response:",data);

        alert(data.message);

        if(data.message==="Password updated successfully."){

            closeResetModal();

            document.getElementById("password").value="";

            document.getElementById("loginMessage").style.color="green";

            document.getElementById("loginMessage").innerHTML=
            "Password updated successfully. Please login.";

        }

    })

    .catch(error=>{

        console.log(error);

        alert("Unable to reset password.");

    });

}

// ======================================
// Close Reset Password Modal
// ======================================

function closeResetModal(){

    document.getElementById("resetModal").style.display="none";

    document.getElementById("newPassword").value="";

    document.getElementById("confirmPassword").value="";

}
// ======================================
// Prevent Closing Modal by Clicking Outside
// ======================================

window.onclick = function(event){

    const otpModal = document.getElementById("otpModal");

    const resetModal = document.getElementById("resetModal");

    if(event.target === otpModal){

        event.stopPropagation();

    }

    if(event.target === resetModal){

        event.stopPropagation();

    }

};


// ======================================
// Close Modal using ESC Key
// ======================================

document.addEventListener("keydown",function(event){

    if(event.key==="Escape"){

        closeOTPModal();

        closeResetModal();

    }

});


// ======================================
// Auto Focus OTP Input
// ======================================

const otpObserver = new MutationObserver(function(){

    const modal = document.getElementById("otpModal");

    if(modal.style.display==="flex"){

        setTimeout(()=>{

            document.getElementById("otp").focus();

        },100);

    }

});

otpObserver.observe(

    document.getElementById("otpModal"),

    {

        attributes:true,

        attributeFilter:["style"]

    }

);


// ======================================
// Auto Focus New Password
// ======================================

const resetObserver = new MutationObserver(function(){

    const modal = document.getElementById("resetModal");

    if(modal.style.display==="flex"){

        setTimeout(()=>{

            document.getElementById("newPassword").focus();

        },100);

    }

});

resetObserver.observe(

    document.getElementById("resetModal"),

    {

        attributes:true,

        attributeFilter:["style"]

    }

);


// ======================================
// Allow Enter Key
// ======================================

document.getElementById("otp").addEventListener(

    "keypress",

    function(event){

        if(event.key==="Enter"){

            verifyOTP();

        }

    }

);

document.getElementById("confirmPassword").addEventListener(

    "keypress",

    function(event){

        if(event.key==="Enter"){

            resetPassword();

        }

    }

);
// ======================================
// Generate CAPTCHA on Page Load
// ======================================

window.onload = function(){

    generateCaptcha();

};