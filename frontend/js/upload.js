function uploadCSV() {

    const fileInput = document.getElementById("csvFile");

    if (fileInput.files.length === 0) {

        alert("Please choose a CSV file.");

        return;

    }

    const formData = new FormData();

    formData.append("file", fileInput.files[0]);

    fetch("http://127.0.0.1:8001/upload/csv", {

        method: "POST",

        body: formData

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("status").innerHTML =

            "✅ " + data.message +

            "<br><br>Transactions Added: " +

            data.rows_inserted;

    })

    .catch(error => {

        console.log(error);

        document.getElementById("status").innerHTML =

            "❌ Upload Failed";

    });

}