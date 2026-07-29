// =====================================================
// AI PERSONAL FINANCE TRACKER
// PREMIUM ANALYTICS DASHBOARD
// =====================================================


// =====================================================
// Logged In User
// =====================================================

const email = localStorage.getItem("loggedInUser");

if (!email) {

    window.location.href = "login.html";

}

console.log("Logged In User:", email);

  // =====================================================
// Theme Colors
// =====================================================

const styles = getComputedStyle(document.body);

const textColor =
    styles.getPropertyValue("--text").trim();

const textLight =
    styles.getPropertyValue("--text-light").trim();

const borderColor =
    styles.getPropertyValue("--border").trim();

const surface =
    styles.getPropertyValue("--surface").trim();


// =====================================================
// DOM ELEMENTS
// =====================================================

const monthFilter =
    document.getElementById("monthFilter");

const incomeCard =
    document.getElementById("incomeCard");

const expenseCard =
    document.getElementById("expenseCard");

const averageCard =
    document.getElementById("averageCard");

const topCategoryCard =
    document.getElementById("topCategoryCard");

const summaryBody =
    document.getElementById("categorySummaryBody");

const insightText =
    document.getElementById("analyticsInsight");


// =====================================================
// Charts
// =====================================================

let budgetExpenseChart = null;

let groupedBarChart = null;

let stackedBarChart = null;


// =====================================================
// Default Month
// =====================================================

monthFilter.value =
    new Date().toISOString().slice(0, 7);


// =====================================================
// Events
// =====================================================

loadPageData();

monthFilter.addEventListener(

    "change",

    loadPageData

);


// =====================================================
// Currency Formatter
// =====================================================

function formatCurrency(value) {

    return "₹" +

        Number(value).toLocaleString(

            "en-IN",

            {

                maximumFractionDigits: 0

            }

        );

}


// =====================================================
// Capitalize Text
// =====================================================

function capitalize(text) {

    if (!text) return "-";

    return text.charAt(0).toUpperCase()

        + text.slice(1);

}


// =====================================================
// Animated Counter
// =====================================================

function animateValue(element, endValue, prefix = "₹") {

    const duration = 1200;

    const startValue = 0;

    const startTime = performance.now();

    function update(currentTime) {

        const progress = Math.min(

            (currentTime - startTime) / duration,

            1

        );

        const value = Math.floor(

            startValue +

            (endValue - startValue) * progress

        );

        if (prefix === "") {

            element.textContent = value;

        }

        else {

            element.textContent =

                prefix +

                value.toLocaleString("en-IN");

        }

        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

}


// =====================================================
// Animate Table Rows
// =====================================================

function animateTableRows() {

    const rows =

        summaryBody.querySelectorAll("tr");

    rows.forEach((row, index) => {

        row.style.opacity = "0";

        row.style.transform =

            "translateY(25px)";

        row.style.transition =

            "all .5s ease";

        setTimeout(() => {

            row.style.opacity = "1";

            row.style.transform =

                "translateY(0)";

        }, index * 120);

    });

}


// =====================================================
// Destroy Existing Charts
// =====================================================

function destroyCharts() {

    if (budgetExpenseChart) {

        budgetExpenseChart.destroy();

        budgetExpenseChart = null;

    }

    if (groupedBarChart) {

        groupedBarChart.destroy();

        groupedBarChart = null;

    }

    if (stackedBarChart) {

        stackedBarChart.destroy();

        stackedBarChart = null;

    }

}


// =====================================================
// Shared Chart Options
// =====================================================

function commonChartOptions() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        animation: {

            duration: 1800,

            easing: "easeOutExpo",

            delay(context) {

                return context.dataIndex * 120;

            }

        },

        plugins: {

            legend: {

                labels: {

    color: textLight,

    font: {

        size: 13,

        weight: "600"

    }

}

            },

            tooltip: {

    backgroundColor: surface,

    titleColor: textColor,

    bodyColor: textLight,

    borderColor: borderColor,

    borderWidth: 1,

    cornerRadius: 12,

    padding: 12

}

        }

    };

}


// =====================================================
// Load Analytics
// =====================================================

function loadPageData() {

    const month = monthFilter.value;
        // =====================================================
    // Fetch Analytics Data
    // =====================================================

    fetch(

        `http://127.0.0.1:8002/analytics/category-summary/${email}?month=${month}`

    )

    .then(response => {

        if (!response.ok) {

            throw new Error("Unable to load analytics.");

        }

        return response.json();

    })

    .then(data => {

        console.log(data);

        destroyCharts();

        // =====================================================
        // Extract Data
        // =====================================================

        const budgetData =
            data.budget_vs_expense || {};

        const monthlySummary =
            data.monthly_category_summary || {};

        const categories =
            Object.keys(budgetData);

        // =====================================================
        // Empty State
        // =====================================================

        if (categories.length === 0) {

            incomeCard.textContent = "₹0";

            expenseCard.textContent = "₹0";

            averageCard.textContent = "₹0";

            topCategoryCard.textContent = "-";

            summaryBody.innerHTML = `

                <tr>

                    <td colspan="4"
                        style="
                            text-align:center;
                            padding:35px;
                            color:#94A3B8;
                        ">

                        No analytics available for this month.

                    </td>

                </tr>

            `;

            insightText.innerHTML =

                "No analytics available for the selected month.";

            return;

        }

        // =====================================================
        // Calculate Totals
        // =====================================================

        let totalBudget = 0;

        let totalExpense = 0;

        let highestExpense = 0;

        let highestCategory = "-";

        categories.forEach(category => {

            const budget =
                Number(budgetData[category].budget || 0);

            const expense =
                Number(budgetData[category].expense || 0);

            totalBudget += budget;

            totalExpense += expense;

            if (expense > highestExpense) {

                highestExpense = expense;

                highestCategory = category;

            }

        });

        const averageExpense =

            categories.length === 0

                ? 0

                : totalExpense / categories.length;

        // =====================================================
        // Animated Summary Cards
        // =====================================================

        animateValue(

            incomeCard,

            totalBudget

        );

        animateValue(

            expenseCard,

            totalExpense

        );

        animateValue(

            averageCard,

            averageExpense

        );

        topCategoryCard.textContent =

            capitalize(highestCategory);

        // =====================================================
        // Category Summary Table
        // =====================================================

        summaryBody.innerHTML = "";

        categories.forEach(category => {

            const budget =
                Number(budgetData[category].budget || 0);

            const expense =
                Number(budgetData[category].expense || 0);

            const percentage =

                budget === 0

                    ? 0

                    : ((expense / budget) * 100).toFixed(1);

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

        animateTableRows();

        // =====================================================
        // AI Insight
        // =====================================================

        if (totalExpense > totalBudget) {

            insightText.innerHTML =

                `⚠️ You exceeded your planned budget by
                <b>${formatCurrency(totalExpense - totalBudget)}</b>.
                Your highest spending category is
                <b>${capitalize(highestCategory)}</b>.`;

        }

        else {

            insightText.innerHTML =

                `✅ Great job! You stayed within your planned budget.
                Your highest spending category this month is
                <b>${capitalize(highestCategory)}</b>.`;

        }

        // =====================================================
        // Prepare Chart Data
        // =====================================================

        const budgets =

            categories.map(category =>

                budgetData[category].budget

            );

        const expenses =

            categories.map(category =>

                budgetData[category].expense

            );

        const months =
            Object.keys(monthlySummary);

        const categorySet =
            new Set();

        months.forEach(month => {

            Object.keys(

                monthlySummary[month]

            ).forEach(category => {

                categorySet.add(category);

            });

        });

        const categoryList =
            [...categorySet];

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

        const datasets =

            categoryList.map((category, index) => ({

                label: capitalize(category),

                data: months.map(month =>

                    monthlySummary[month][category] || 0

                ),

                backgroundColor:
                    colors[index % colors.length],

                borderColor:
                    colors[index % colors.length],

                borderRadius: 10,

                borderWidth: 1

            }));

        // =====================================================
        // Budget vs Expense Chart
        // =====================================================
                // =====================================================
        // Budget vs Expense Chart
        // =====================================================

        budgetExpenseChart = new Chart(

            document.getElementById("budgetExpenseChart"),

            {

                type: "bar",

                data: {

                    labels: categories.map(category =>

                        capitalize(category)

                    ),

                    datasets: [

                        {

                            label: "Budget",

                            data: budgets,

                            backgroundColor: "#24D6F5",

                            borderRadius: 12,

                            borderSkipped: false,

                            barThickness: 22

                        },

                        {

                            label: "Expense",

                            data: expenses,

                            backgroundColor: "#FF6384",

                            borderRadius: 12,

                            borderSkipped: false,

                            barThickness: 22

                        }

                    ]

                },

                options: {

                    ...commonChartOptions(),

                    plugins: {

                        ...commonChartOptions().plugins,

                        title: {

    display: true,

    text: "Budget vs Expense",

    color: textColor,

                            font: {

                                size: 18,

                                weight: "700"

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color: textLight

                            },

                            grid: {

                                color: borderColor

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                color: textLight

                            },

                            grid: {

                               color: borderColor

                            }

                        }

                    }

                }

            }

        );



        // =====================================================
        // Category Comparison Chart
        // =====================================================

        groupedBarChart = new Chart(

            document.getElementById("groupedBarChart"),

            {

                type: "bar",

                data: {

                    labels: months,

                    datasets: datasets

                },

                options: {

                    ...commonChartOptions(),

                    plugins: {

                        ...commonChartOptions().plugins,

                        title: {

                            display: true,

                            text: "Category Expense Comparison",

                            color:textColor,

                            font: {

                                size: 18,

                                weight: "700"

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color:textLight

                            },

                            grid: {

                                color:borderColor

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {
                                color:textLight

                            },

                            grid: {

                                color:borderColor

                            }

                        }

                    }

                }

            }

        );



        // =====================================================
        // Monthly Category-wise Expense Chart
        // =====================================================

        stackedBarChart = new Chart(

            document.getElementById("stackedBarChart"),

            {

                type: "bar",

                data: {

                    labels: months,

                    datasets: datasets

                },

                options: {

                    ...commonChartOptions(),

                    plugins: {

                        ...commonChartOptions().plugins,

                        title: {

                            display: true,

                            text: "Monthly Category-wise Expenses",

                            color:textColor,

                            font: {

                                size: 18,

                                weight: "700"

                            }

                        }

                    },

                    scales: {

    x: {

        stacked: true,

        ticks: {

            color: textLight

        },

        grid: {

            color: borderColor

        }

    },

    y: {

        stacked: true,

        beginAtZero: true,

        ticks: {

            color: textLight

        },

        grid: {

            color: borderColor

        }

    }

}

                }

            }

        );
    
                // =====================================================
        // Refresh Animations
        // =====================================================

        animateTableRows();

        document.querySelectorAll(".analytics-card").forEach(

            (card, index) => {

                card.style.opacity = "0";

                card.style.transform = "translateY(25px)";

                card.style.transition = "all .5s ease";

                setTimeout(() => {

                    card.style.opacity = "1";

                    card.style.transform = "translateY(0)";

                }, index * 120);

            }

        );

    })

    // =====================================================
    // Error Handling
    // =====================================================

    .catch(error => {

        console.error(

            "Analytics Error:",

            error

        );

        insightText.innerHTML =

            "Unable to load analytics data.";

        summaryBody.innerHTML =

            `

            <tr>

                <td colspan="4"

                    style="

                        text-align:center;

                        padding:25px;

                        color:#EF4444;

                    ">

                    Unable to load analytics.

                </td>

            </tr>

            `;

        destroyCharts();

    });

}
// =====================================================
// Premium Page Entrance Animation
// =====================================================

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

    document.querySelectorAll(

        ".fade-up, .fade-left, .fade-right, .zoom-in"

    ).forEach((element, index) => {

        element.style.opacity = "0";

        element.style.transform = "translateY(25px)";

        setTimeout(() => {

            element.style.transition = "all .6s ease";

            element.style.opacity = "1";

            element.style.transform = "translateY(0)";

        }, index * 80);

    });

});


// =====================================================
// Refresh Analytics without Flicker
// =====================================================

function refreshAnalytics(){

    document.querySelectorAll(

        ".chart-card"

    ).forEach(card=>{

        card.style.opacity=".5";

        card.style.transition=".3s";

    });

    loadPageData();

    setTimeout(()=>{

        document.querySelectorAll(

            ".chart-card"

        ).forEach(card=>{

            card.style.opacity="1";

        });

    },500);

}


// =====================================================
// Animate Cards on Scroll
// =====================================================

const observer = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},

{

    threshold:0.15

}

);

document.querySelectorAll(

".analytics-card,.chart-card,.table-card,.insight-card"

).forEach(card=>{

    observer.observe(card);

});


// =====================================================
// Smooth Counter Refresh
// =====================================================

function updateCounter(element,newValue){

    animateValue(

        element,

        Number(newValue)

    );

}


// =====================================================
// Auto Refresh Every 5 Minutes
// =====================================================

setInterval(()=>{

    console.log("Refreshing analytics...");

    refreshAnalytics();

},300000);


// =====================================================
// Window Resize Handling
// =====================================================

window.addEventListener(

    "resize",

    ()=>{

        if(budgetExpenseChart){

            budgetExpenseChart.resize();

        }

        if(groupedBarChart){

            groupedBarChart.resize();

        }

        if(stackedBarChart){

            stackedBarChart.resize();

        }

    }

);


// =====================================================
// Console Message
// =====================================================

console.log(

    "%cPremium Analytics Loaded",

    "color:#24d6f5;font-size:18px;font-weight:bold;"

);