const email = localStorage.getItem("loggedInUser");

console.log("Logged in user:", email);

fetch(`http://127.0.0.1:8001/analytics/category-summary/${email}`)
    .then(response => response.json())
    .then(data => {

        console.log("Analytics Data:", data);

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (labels.length === 0) {
            alert("No transactions available for this user.");
            return;
        }

        // Pie Chart
        new Chart(document.getElementById("pieChart"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Expenses",
                    data: values
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Bar Chart
        new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Expenses",
                    data: values
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    })
    .catch(error => {
        console.error("Analytics Error:", error);
        alert("Unable to load analytics.");
    });