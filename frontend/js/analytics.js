// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

console.log("Logged in user:", email);

// ======================================
// Global Variables
// ======================================

let pieChart = null;
let lineChart = null;
let radarChart = null;

const monthFilter = document.getElementById("monthFilter");

// Default = Current Month
monthFilter.value = new Date().toISOString().slice(0, 7);

// Initial Load
loadPageData();

// Reload when month changes
monthFilter.addEventListener("change", loadPageData);

// ======================================
// Load Analytics
// ======================================

function loadPageData() {

    const month = monthFilter.value;

    fetch(
        `http://127.0.0.1:8001/analytics/category-summary/${email}?month=${month}`
    )

    .then(response => response.json())

    .then(data => {

        console.log("Analytics Data:", data);

        const categoryLabels = Object.keys(data.category_summary);
        const categoryValues = Object.values(data.category_summary);

        const monthLabels = Object.keys(data.monthly_summary);
        const monthValues = Object.values(data.monthly_summary);

        if (categoryLabels.length === 0) {

            alert("No transactions available for this month.");

            return;

        }

        // =====================================
        // PIE CHART
        // =====================================

        if (pieChart) {

            pieChart.destroy();

        }

        pieChart = new Chart(

            document.getElementById("pieChart"),

            {

                type: "pie",

                data: {

                    labels: categoryLabels,

                    datasets: [{

                        data: categoryValues,

                        backgroundColor: [

                            "#36A2EB",
                            "#FF6384",
                            "#FF9F40",
                            "#FFD166",
                            "#4BC0C0",
                            "#9966FF",
                            "#C9CBCF",
                            "#3FA9F5"

                        ],

                        borderColor: "#ffffff",

                        borderWidth: 2

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "top",

                            labels: {

                                color: "#ffffff",

                                font: {

                                    size: 18,

                                    weight: "bold"

                                }

                            }

                        }

                    }

                }

            }

        );

        // =====================================
        // LINE CHART
        // =====================================

        if (lineChart) {

            lineChart.destroy();

        }

        lineChart = new Chart(

            document.getElementById("lineChart"),

            {

                type: "line",

                data: {

                    labels: monthLabels,

                    datasets: [{

                        label: "Monthly Expense",

                        data: monthValues,

                        borderColor: "#18E3FF",

                        backgroundColor: "rgba(24,227,255,0.25)",

                        fill: true,

                        tension: 0.4,

                        borderWidth: 5,

                        pointRadius: 6,

                        pointBackgroundColor: "#ffffff",

                        pointBorderColor: "#18E3FF",

                        pointBorderWidth: 4

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#ffffff",

                                font: {

                                    size: 18,

                                    weight: "bold"

                                }

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color: "#ffffff",

                                font: {

                                    size: 15,

                                    weight: "bold"

                                }

                            },

                            grid: {

                                color: "rgba(255,255,255,0.15)"

                            }

                        },

                        y: {

                            ticks: {

                                color: "#ffffff",

                                font: {

                                    size: 15,

                                    weight: "bold"

                                }

                            },

                            grid: {

                                color: "rgba(255,255,255,0.15)"

                            }

                        }

                    }

                }

            }

        );

        // =====================================
        // RADAR CHART
        // =====================================

        if (radarChart) {

            radarChart.destroy();

        }

        radarChart = new Chart(

            document.getElementById("radarChart"),

            {

                type: "radar",

                data: {

                    labels: categoryLabels,

                    datasets: [{

                        label: "Category Expenses",

                        data: categoryValues,

                        backgroundColor: "rgba(24,227,255,0.25)",

                        borderColor: "#18E3FF",

                        borderWidth: 4,

                        pointBackgroundColor: "#ffffff",

                        pointBorderColor: "#18E3FF",

                        pointRadius: 5,

                        pointHoverRadius: 7

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#ffffff",

                                font: {

                                    size: 18,

                                    weight: "bold"

                                }

                            }

                        }

                    },

                    scales: {

                        r: {

                            angleLines: {

                                color: "rgba(255,255,255,0.15)"

                            },

                            grid: {

                                color: "rgba(255,255,255,0.15)"

                            },

                            pointLabels: {

                                color: "#ffffff",

                                font: {

                                    size: 15,

                                    weight: "bold"

                                }

                            },

                            ticks: {

                                color: "#ffffff",

                                backdropColor: "transparent",

                                font: {

                                    size: 13,

                                    weight: "bold"

                                }

                            }

                        }

                    }

                }

            }

        );

    })

    .catch(error => {

        console.error("Analytics Error:", error);

        alert("Unable to load analytics.");

    });

}