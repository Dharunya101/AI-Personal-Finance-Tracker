// ======================================
// Upload Bank Statement
// ======================================

const fileInput = document.getElementById("statementFile");

const selectedFile = document.getElementById("selectedFile");

const progressFill = document.getElementById("progressFill");

const progressText = document.getElementById("progressText");

const status = document.getElementById("status");

// ======================================
// Show Selected File
// ======================================

if(fileInput){

    fileInput.addEventListener("change",()=>{

        if(fileInput.files.length>0){

            selectedFile.innerHTML="📄 "+fileInput.files[0].name;

        }

        else{

            selectedFile.innerHTML="No file selected";

        }

    });

}

// ======================================
// Clear Upload
// ======================================

function clearUpload(){

    fileInput.value="";

    selectedFile.innerHTML="No file selected";

    progressFill.style.width="0%";

    progressText.innerHTML="0%";

    status.style.color="var(--primary)";

    status.innerHTML="Waiting for file upload...";

    document.getElementById("transactionCount").innerHTML="0";

    document.getElementById("categoryCount").innerHTML="0";

    document.getElementById("totalAmount").innerHTML="₹0";

    document.getElementById("uploadStatus").innerHTML="Waiting";

}

// ======================================
// Upload Statement
// ======================================

function uploadCSV(){

    if(fileInput.files.length===0){

        alert("Please choose a CSV or PDF file.");

        return;

    }

    const file=fileInput.files[0];

    const fileName=file.name.toLowerCase();

    if(

        !fileName.endsWith(".csv") &&

        !fileName.endsWith(".pdf")

    ){

        alert("Only CSV and PDF files are supported.");

        return;

    }

    const formData=new FormData();

    formData.append("file",file);

    formData.append(

        "user_email",

        localStorage.getItem("loggedInUser")

    );

    status.style.color="white";

    status.innerHTML="Uploading statement...";

    animateProgress();
        fetch("http://127.0.0.1:8002/upload/statement",{

        method:"POST",

        body:formData

    })

    .then(response=>{

        if(!response.ok){

            throw new Error("Upload failed.");

        }

        return response.json();

    })

    .then(data=>{

        progressFill.style.width="100%";

        progressText.innerHTML="100%";

        status.style.color="#00e676";

        status.innerHTML=

            "✅ "+data.message+

            "<br><br>Transactions Added : "+

            data.rows_inserted;

        document.getElementById("transactionCount").innerHTML=

            data.rows_inserted ?? 0;

        if(data.categories_found!==undefined){

            document.getElementById("categoryCount").innerHTML=

                data.categories_found;

        }

        if(data.total_amount!==undefined){

            document.getElementById("totalAmount").innerHTML=

                "₹"+Number(data.total_amount).toLocaleString();

        }

        document.getElementById("uploadStatus").innerHTML=

            "Completed";

        fileInput.value="";

        selectedFile.innerHTML="No file selected";

        setTimeout(()=>{

            window.location.href="transactions.html";

        },2000);

    })

    .catch(error=>{

        console.error(error);

        progressFill.style.width="0%";

        progressText.innerHTML="0%";

        status.style.color="#ff5252";

        status.innerHTML=

            "❌ Upload Failed.<br>Please try again.";

        document.getElementById("uploadStatus").innerHTML=

            "Failed";

    });

}
// ======================================
// Animated Progress
// ======================================

function animateProgress(){

    let progress = 0;

    progressFill.style.width = "0%";

    progressText.innerHTML = "0%";

    const interval = setInterval(() => {

        progress += 5;

        if(progress >= 90){

            clearInterval(interval);

            return;

        }

        progressFill.style.width = progress + "%";

        progressText.innerHTML = progress + "%";

    },100);

}

// ======================================
// Drag & Drop Upload
// ======================================

const uploadZone = document.querySelector(".upload-zone");

if(uploadZone){

    ["dragenter","dragover"].forEach(eventName => {

        uploadZone.addEventListener(eventName,e=>{

            e.preventDefault();

            uploadZone.classList.add("drag-over");

        });

    });

    ["dragleave","dragend"].forEach(eventName => {

        uploadZone.addEventListener(eventName,e=>{

            e.preventDefault();

            uploadZone.classList.remove("drag-over");

        });

    });

    uploadZone.addEventListener("drop",e=>{

        e.preventDefault();

        uploadZone.classList.remove("drag-over");

        if(e.dataTransfer.files.length){

            fileInput.files = e.dataTransfer.files;

            selectedFile.innerHTML =

                "📄 " + e.dataTransfer.files[0].name;

        }

    });

}

// ======================================
// Prevent Browser Opening File
// ======================================

document.addEventListener("dragover",e=>{

    e.preventDefault();

});

document.addEventListener("drop",e=>{

    e.preventDefault();

});