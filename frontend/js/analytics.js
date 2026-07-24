// ======================================
// AI PERSONAL FINANCE TRACKER
// Analytics Dashboard
// ======================================


// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

console.log("Logged In User:", email);


// ======================================
// DOM ELEMENTS
// ======================================

const monthFilter = document.getElementById("monthFilter");

const incomeCard = document.getElementById("incomeCard");

const expenseCard = document.getElementById("expenseCard");

const averageCard = document.getElementById("averageCard");

const topCategoryCard = document.getElementById("topCategoryCard");

const summaryBody = document.getElementById("categorySummaryBody");

const insightText = document.getElementById("analyticsInsight");


// ======================================
// Charts
// ======================================

let budgetExpenseChart = null;

let groupedBarChart = null;

let stackedBarChart = null;


// ======================================
// Default Month
// ======================================

monthFilter.value = new Date().toISOString().slice(0,7);


// ======================================
// Page Load
// ======================================

loadPageData();

monthFilter.addEventListener(

    "change",

    loadPageData

);


// ======================================
// Currency Formatter
// ======================================

function formatCurrency(value){

    return "₹" +

    Number(value).toLocaleString(

        "en-IN",

        {

            maximumFractionDigits:0

        }

    );

}


// ======================================
// Capitalize Text
// ======================================

function capitalize(text){

    if(!text) return "-";

    return text.charAt(0).toUpperCase()

    + text.slice(1);

}


// ======================================
// Destroy Existing Charts
// ======================================

function destroyCharts(){

    if(budgetExpenseChart){

        budgetExpenseChart.destroy();

        budgetExpenseChart = null;

    }

    if(groupedBarChart){

        groupedBarChart.destroy();

        groupedBarChart = null;

    }

    if(stackedBarChart){

        stackedBarChart.destroy();

        stackedBarChart = null;

    }

}


// ======================================
// Load Analytics
// ======================================

function loadPageData(){

    const month = monthFilter.value;

    fetch(

        `http://127.0.0.1:8002/analytics/category-summary/${email}?month=${month}`

    )

    .then(response=>response.json())

    .then(data=>{

        console.log(data);

        destroyCharts();

        // ==================================
        // Extract Data
        // ==================================

        const budgetData = data.budget_vs_expense;

        const monthlySummary =

            data.monthly_category_summary;

        const categories =

            Object.keys(budgetData);

        if(categories.length===0){

            alert(

                "No transactions found for this month."

            );

            return;

        }

        // ==================================
        // Totals
        // ==================================

        let totalBudget = 0;

        let totalExpense = 0;

        let highestExpense = 0;

        let highestCategory = "-";

        categories.forEach(category=>{

            totalBudget +=

                budgetData[category].budget;

            totalExpense +=

                budgetData[category].expense;

            if(

                budgetData[category].expense

                >

                highestExpense

            ){

                highestExpense =

                    budgetData[category].expense;

                highestCategory =

                    category;

            }

        });

        const averageExpense =

            totalExpense /

            categories.length;
                    // ==================================
        // Populate Summary Cards
        // ==================================

        incomeCard.innerHTML =

            formatCurrency(totalBudget);

        expenseCard.innerHTML =

            formatCurrency(totalExpense);

        averageCard.innerHTML =

            formatCurrency(averageExpense);

        topCategoryCard.innerHTML =

            capitalize(highestCategory);

        // ==================================
        // Category Summary Table
        // ==================================

        summaryBody.innerHTML = "";

        categories.forEach(category=>{

            const budget =

                budgetData[category].budget;

            const expense =

                budgetData[category].expense;

            const percentage =

                budget===0

                ? 0

                : ((expense/budget)*100).toFixed(1);

            summaryBody.innerHTML += `

                <tr>

                    <td>

                        ${capitalize(category)}

                    </td>

                    <td>

                        ${formatCurrency(expense)}

                    </td>

                    <td>

                        ${percentage}%

                    </td>

                    <td>

                        ${formatCurrency(budget)}

                    </td>

                </tr>

            `;

        });

        // ==================================
        // AI Insight
        // ==================================

        if(totalExpense>totalBudget){

            insightText.innerHTML=

            `⚠️ You have exceeded your planned budget by
            <b>${formatCurrency(totalExpense-totalBudget)}</b>.
            Your highest spending category is
            <b>${capitalize(highestCategory)}</b>.`;

        }

        else{

            insightText.innerHTML=

            `✅ Great job! You are within your planned budget.
            Your highest spending category this month is
            <b>${capitalize(highestCategory)}</b>.`;

        }

        // ==================================
        // Budget vs Expense Chart Data
        // ==================================

        const budgets =

            categories.map(category=>

                budgetData[category].budget

            );

        const expenses =

            categories.map(category=>

                budgetData[category].expense

            );

        // ==================================
        // Budget vs Expense Chart
        // ==================================

        budgetExpenseChart = new Chart(

            document.getElementById(

                "budgetExpenseChart"

            ),

            {

                type:"bar",

                data:{

                    labels:

                        categories.map(

                            category=>

                            capitalize(category)

                        ),

                    datasets:[

                        {

                            label:"Budget",

                            data:budgets,

                            backgroundColor:"#24d6f5",

                            borderRadius:10

                        },

                        {

                            label:"Expense",

                            data:expenses,

                            backgroundColor:"#ff6384",

                            borderRadius:10

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

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

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,.08)"

                            }

                        },

                        y:{

                            beginAtZero:true,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,.08)"

                            }

                        }

                    }

                }

            }

        );

        // ==================================
        // Monthly Summary
        // ==================================

        const months =

            Object.keys(monthlySummary);

        const categorySet =

            new Set();

        months.forEach(month=>{

            Object.keys(

                monthlySummary[month]

            ).forEach(category=>{

                categorySet.add(category);

            });

        });

        const categoryList =

            [...categorySet];
                    // ==================================
        // Chart Colors
        // ==================================

        const colors = [

            "#24d6f5",
            "#4f7cff",
            "#ff6384",
            "#ff9f40",
            "#4bc0c0",
            "#9966ff",
            "#00c853",
            "#ffd166"

        ];

        // ==================================
        // Create Datasets
        // ==================================

        const datasets = categoryList.map((category,index)=>{

            return{

                label:capitalize(category),

                data:months.map(month=>

                    monthlySummary[month][category] || 0

                ),

                backgroundColor:

                    colors[index % colors.length],

                borderColor:

                    colors[index % colors.length],

                borderRadius:8,

                borderWidth:1

            };

        });

        // ==================================
        // Monthly Category-wise Expenses
        // ==================================

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

                                    size:13,

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

                                color:"rgba(255,255,255,.08)"

                            }

                        },

                        y:{

                            stacked:true,

                            beginAtZero:true,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,.08)"

                            }

                        }

                    }

                }

            }

        );

        // ==================================
        // Category Comparison Chart
        // ==================================

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

                                    size:13,

                                    weight:"bold"

                                }

                            }

                        },

                        title:{

                            display:true,

                            text:"Category Expense Comparison",

                            color:"#ffffff",

                            font:{

                                size:18,

                                weight:"bold"

                            }

                        }

                    },

                    scales:{

                        x:{

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,.08)"

                            }

                        },

                        y:{

                            beginAtZero:true,

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:"rgba(255,255,255,.08)"

                            }

                        }

                    }

                }

            }

        );

    })

    .catch(error=>{

        console.error(

            "Analytics Error:",

            error

        );

        insightText.innerHTML=

            "Unable to load analytics data.";

        summaryBody.innerHTML=

            `<tr>

                <td colspan="4">

                    Unable to load analytics.

                </td>

            </tr>`;

    });

}