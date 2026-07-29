// ======================================
// Logged In User
// ======================================

const email = localStorage.getItem("loggedInUser");

// ======================================
// Currency Formatter
// ======================================

const formatter = new Intl.NumberFormat("en-IN", {

    style:"currency",

    currency:"INR"

});
const styles = getComputedStyle(document.body);

const textColor = styles.getPropertyValue("--text").trim();

const textLight = styles.getPropertyValue("--text-light").trim();

const borderColor = styles.getPropertyValue("--border").trim();

const surface = styles.getPropertyValue("--surface").trim();

let pieChart = null;

let barChart = null;

// ======================================
// Load Insights
// ======================================

async function loadInsights(){

    try{

        const response = await fetch(

            `http://127.0.0.1:8002/insights/${email}`

        );

        const data = await response.json();

        // ======================================
        // Financial Health Score
        // ======================================

        let health = 100;

        if(data.total_income > 0){

            const ratio = data.total_expense / data.total_income;

            health = Math.max(0,Math.round((1-ratio)*100));

        }

        document.getElementById("healthScore").innerHTML =
            health + "/100";

        // ======================================
        // Cards
        // ======================================

        document.getElementById("income").innerHTML =
            formatter.format(data.total_income);

        document.getElementById("expense").innerHTML =
            formatter.format(data.total_expense);

        document.getElementById("savings").innerHTML =
            formatter.format(data.savings);

        document.getElementById("highest").innerHTML =
            data.highest_category;

        document.getElementById("transactions").innerHTML =
            data.total_transactions;

        document.getElementById("highestCategory").innerHTML =
            data.highest_category;

        // ======================================
        // Risk Level
        // ======================================

        let risk = "Low";

        if(health < 70) risk = "Medium";

        if(health < 40) risk = "High";

        document.getElementById("riskLevel").innerHTML = risk;

        // ======================================
        // AI Summary
        // ======================================

        document.getElementById("aiSummary").innerHTML =

            `You have completed <strong>${data.total_transactions}</strong> transactions.

            Your highest spending category is <strong>${data.highest_category}</strong>.

            Your estimated savings are <strong>${formatter.format(data.savings)}</strong>.

            Current financial health score is <strong>${health}/100</strong>.`;
                    // ======================================
        // Personalized Recommendations
        // ======================================

        const recommendationList =
            document.getElementById("recommendationList");

        recommendationList.innerHTML = "";

        const recommendations = [];

        if(data.savings > 0){

            recommendations.push({

                icon:"💰",

                title:"Increase Savings",

                text:`You saved ${formatter.format(data.savings)} this period. Consider investing a portion for long-term growth.`

            });

        }

        recommendations.push({

            icon:"📊",

            title:"Top Expense",

            text:`Your highest spending category is ${data.highest_category}. Review these expenses regularly.`

        });

        if(health < 50){

            recommendations.push({

                icon:"⚠️",

                title:"Reduce Spending",

                text:"Your financial health score is low. Reducing discretionary expenses can improve your financial stability."

            });

        }

        recommendations.push({

            icon:"🎯",

            title:"Budget Planning",

            text:"Create or adjust monthly budgets to keep spending aligned with your income."

        });

        recommendations.forEach(item=>{

            recommendationList.innerHTML += `

            <div class="recommendation-card">

                <div class="recommendation-icon">

                    ${item.icon}

                </div>

                <div class="recommendation-content">

                    <h3>

                        ${item.title}

                    </h3>

                    <p>

                        ${item.text}

                    </p>

                </div>

            </div>

            `;

        });

        // ======================================
        // Smart Saving Opportunities
        // ======================================

        const savingGrid =
            document.getElementById("savingTips");

        savingGrid.innerHTML = "";

        Object.entries(data.category_summary)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,3)

        .forEach(([category,amount])=>{

            const possibleSaving = amount * 0.15;

            savingGrid.innerHTML += `

            <div class="saving-card">

                <h3>

                    ${category}

                </h3>

                <p>

                    Reducing spending by approximately 15% in this category could improve your monthly savings.

                </p>

                <span class="saving-amount">

                    Save ${formatter.format(possibleSaving)}

                </span>

            </div>

            `;

        });

        // ======================================
        // Destroy Previous Charts
        // ======================================

        if(pieChart){

            pieChart.destroy();

        }

        if(barChart){

            barChart.destroy();

        }

        const labels = Object.keys(data.category_summary);

        const values = Object.values(data.category_summary);
                // ======================================
        // Category Distribution Chart
        // ======================================

        pieChart = new Chart(

            document.getElementById("pieChart"),

            {

                type:"doughnut",

                data:{

                    labels:labels,

                    datasets:[{

                        data:values,

                        backgroundColor:[

                            "#24d6f5",
                            "#4f7cff",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#a855f7",
                            "#06b6d4",
                            "#ec4899"

                        ],

                        borderWidth:0

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    cutout:"65%",
                    radius:"80%",
layout:{
    padding:20
},

                    plugins:{

                        legend:{

                            position:"bottom",

                            labels:{

                                color: textColor,

                                padding:20,

                                font:{

                                    size:14,

                                    family:"Outfit"

                                }

                            }

                        }

                    }

                }

            }

        );

        // ======================================
        // Expense by Category Chart
        // ======================================

        barChart = new Chart(

            document.getElementById("barChart"),

            {

                type:"bar",

                data:{

                    labels:labels,

                    datasets:[{

                        label:"Expense",

                        data:values,

                        borderRadius:10,

                        backgroundColor:"#24d6f5"

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            labels:{

                                color: textColor,

                                font:{

                                    family:"Outfit",

                                    size:14

                                }

                            }

                        }

                    },

                    scales:{

                        x:{

                            ticks:{

                                color: textLight

                            },

                            grid:{

                                display:false

                            }

                        },

                        y:{

                            ticks:{

                                color: textLight

                            },

                            grid:{

                                color: borderColor

                            }

                        }

                    }

                }

            }

        );

    }

    catch(error){

        console.error(error);

        alert("Unable to load insights.");

    }

}

// ======================================
// Initialize
// ======================================

loadInsights();