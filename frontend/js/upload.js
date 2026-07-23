// ======================================
// Upload Bank Statement (CSV / PDF)
// ======================================

function uploadCSV() {

    // Get file input
    const fileInput = document.getElementById("statementFile");

    if (!fileInput) {

        console.error("File input not found!");

        return;

    }

    // Check if a file is selected
    if (fileInput.files.length === 0) {

        alert("Please choose a CSV or PDF file.");

        return;

    }

    const file = fileInput.files[0];

    const fileName = file.name.toLowerCase();

    // Validate file type
    if (
        !fileName.endsWith(".csv") &&
        !fileName.endsWith(".pdf")
    ) {

        alert("Only CSV and PDF files are supported.");

        return;

    }

    // Prepare form data
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "user_email",
        localStorage.getItem("loggedInUser")
    );

    // Show uploading status
    document.getElementById("status").style.color = "white";
    document.getElementById("status").innerHTML =
        "Uploading statement...";

    // Send to backend
    fetch("http://127.0.0.1:8002/upload/statement", {

        method: "POST",

        body: formData

    })

    .then(response => {

        if (!response.ok) {

            throw new Error("Upload failed.");

        }

        return response.json();

    })

    .then(data => {

        document.getElementById("status").style.color = "#00e676";

        document.getElementById("status").innerHTML =

            "✅ " + data.message +

            "<br><br>Transactions Added: " +

            data.rows_inserted;

        // Clear file input
        fileInput.value = "";

        // Redirect
        setTimeout(() => {

            window.location.href = "transactions.html";

        }, 2000);

    })

    .catch(error => {

        console.error(error);

        document.getElementById("status").style.color = "#ff5252";

        document.getElementById("status").innerHTML =

            "❌ Upload Failed.<br>Please try again.";

    });

}