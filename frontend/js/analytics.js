fetch("http://127.0.0.1:8001/analytics/category-summary")

.then(response => response.json())

.then(data => {

    const labels = Object.keys(data);

    const values = Object.values(data);

    new Chart(document.getElementById("pieChart"),{

        type:"pie",

        data:{

            labels:labels,

            datasets:[{

                label:"Expenses",

                data:values

            }]

        }

    });

    new Chart(document.getElementById("barChart"),{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Expenses",

                data:values

            }]

        }

    });

});