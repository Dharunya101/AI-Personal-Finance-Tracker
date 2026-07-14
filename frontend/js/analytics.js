// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

console.log("Logged in user:", email);

// ======================================
// Global Charts
// ======================================

let budgetExpenseChart = null;
let stackedBarChart = null;
let groupedBarChart = null;

// ======================================
// Month Filter
// ======================================

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

function loadPageData(){

    const month = monthFilter.value;

    fetch(
        `http://127.0.0.1:8001/analytics/category-summary/${email}?month=${month}`
    )

    .then(response => response.json())

    .then(data => {

        console.log("Analytics Data:", data);

        // =====================================
        // Budget vs Expense Data
        // =====================================

        const budgetData = data.budget_vs_expense;

        const categories = Object.keys(budgetData);

        if(categories.length === 0){

            alert("No transactions available for this month.");

            return;

        }

        const budgets = categories.map(category =>

            budgetData[category].budget

        );

        const expenses = categories.map(category =>

            budgetData[category].expense

        );

        // Destroy previous chart

        if(budgetExpenseChart){

            budgetExpenseChart.destroy();

        }

        // =====================================
        // Budget vs Expense Chart
        // =====================================

        budgetExpenseChart = new Chart(

            document.getElementById("budgetExpenseChart"),

            {

                type: "bar",

                data: {

                    labels: categories.map(c =>
                        c.charAt(0).toUpperCase() + c.slice(1)
                    ),

                    datasets: [

                        {

                            label: "Budget",

                            data: budgets,

                            backgroundColor: "#36A2EB"

                        },

                        {

                            label: "Expense",

                            data: expenses,

                            backgroundColor: "#FF6384"

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#ffffff",

                                font: {

                                    size: 15,

                                    weight: "bold"

                                }

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color: "#ffffff"

                            },

                            grid: {

                                color: "rgba(255,255,255,0.15)"

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                color: "#ffffff"

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
        // Prepare Monthly Data
        // =====================================

        const monthlyCategory = data.monthly_category_summary;

        const months = Object.keys(monthlyCategory);

        const categorySet = new Set();

        months.forEach(month => {

            Object.keys(monthlyCategory[month]).forEach(category => {

                categorySet.add(category);

            });

        });

        const categoryList = [...categorySet];

        const colors = [

            "#36A2EB",
            "#FF6384",
            "#FF9F40",
            "#4BC0C0",
            "#9966FF",
            "#FFD166",
            "#00C853",
            "#FF6D00"

        ];

        const datasets = [];

        categoryList.forEach((category,index)=>{

            datasets.push({

                label:

                    category.charAt(0).toUpperCase()

                    + category.slice(1),

                data:

                    months.map(month =>

                        monthlyCategory[month][category] || 0

                    ),

                backgroundColor:

                    colors[index % colors.length],

                borderColor:

                    colors[index % colors.length],

                borderWidth:1

            });

        });
                // =====================================
        // Destroy Existing Charts
        // =====================================

        if(stackedBarChart){

            stackedBarChart.destroy();

        }

        if(groupedBarChart){

            groupedBarChart.destroy();

        }

        // =====================================
        // STACKED BAR CHART
        // =====================================

        stackedBarChart = new Chart(

            document.getElementById("stackedBarChart"),

            {

                type:"bar",

                data:{

                    labels:months,

                    datasets:datasets

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            position:"top",

                            labels:{

                                color:"#ffffff",

                                font:{

                                    size:14,

                                    weight:"bold"

                                }

                            }

                        }

                    },

                    scales:{

                        x:{

                            stacked:true,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,0.15)"

                            }

                        },

                        y:{

                            stacked:true,

                            beginAtZero:true,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,0.15)"

                            }

                        }

                    }

                }

            }

        );

        // =====================================
        // CATEGORY COMPARISON
        // =====================================

        groupedBarChart = new Chart(

            document.getElementById("groupedBarChart"),

            {

                type:"bar",

                data:{

                    labels:months,

                    datasets:datasets

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            position:"top",

                            labels:{

                                color:"#ffffff",

                                font:{

                                    size:14,

                                    weight:"bold"

                                }

                            }

                        },

                        title:{

                            display:true,

                            text:"Expense Comparison Across Categories",

                            color:"#ffffff",

                            font:{

                                size:18,

                                weight:"bold"

                            }

                        }

                    },

                    scales:{

                        x:{

                            stacked:false,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,0.15)"

                            }

                        },

                        y:{

                            beginAtZero:true,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,0.15)"

                            }

                        }

                    }

                }

            }

        );

    })

    .catch(error=>{

        console.error("Analytics Error:",error);

        alert("Unable to load analytics.");

    });

}