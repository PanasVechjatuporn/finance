const questions = [
    {
        question: "What is your current age?:",
        options: [
            { text: "\tA. Older than 55 years", weight: 1 },
            { text: "\tB. 45 - 55 years", weight: 2 },
            { text: "\tC. 35 - 44 years", weight: 3 },
            { text: "\tD. Younger than 35 years", weight: 4 }
        ]

    },
    {
        question: "Currently, what proportion of your income is allocated to regular financial obligations and expenses such as mortgage payments, car payments, personal expenses, and family support?",
        options: [
            { text: "\tA. More than 75% of total income", weight: 1 },
            { text: "\tB. Between 50% to 75% of total income", weight: 2 },
            { text: "\tC. Between 25% to 50% of total income", weight: 3 },
            { text: "\tD. Less than 25% of total income", weight: 4 },
        ]
    },
    {
        question: "What is your current financial status?",
        options: [
            { text: "\tA. Assets are less than liabilities", weight: 1 },
            { text: "\tB. Assets equal liabilities", weight: 2 },
            { text: "\tC. Assets exceed liabilities", weight: 3 },
            { text: "\tD. Confident that there are sufficient savings or investments for life after retirement", weight: 4 },
        ]
    },
    {
        question: "In which asset class do you have the most experience or knowledge in investing?",
        options: [
            { text: "\tA. Bank deposits", weight: 1 },
            { text: "\tB. Government bonds or bond mutual funds", weight: 2 },
            { text: "\tC. Debt securities or bond mutual funds", weight: 3 },
            { text: "\tD. Common stocks or equity mutual funds, or other high-risk assets", weight: 4 },
        ]
    },
    {
        question: "For how long do you anticipate not needing to use this investment?",
        options: [
            { text: "\tA. Less than 1 year", weight: 1 },
            { text: "\tB. 1 to 3 years", weight: 2 },
            { text: "\tC. 3 to 5 years", weight: 3 },
            { text: "\tD. More than 5 years", weight: 4 },
        ]
    },
    {
        question: "The primary objective of your investment is:",
        options: [
            { text: "\tA. Emphasize capital preservation with steady returns, but at lower potential returns.", weight: 1 },
            { text: "\tB. Seek steady returns with the possibility of occasional capital loss.", weight: 2 },
            { text: "\tC. Pursue higher potential returns with a higher risk of capital loss.", weight: 3 },
            { text: "\tD. Aim for maximum long-term returns, accepting the possibility of significant capital loss.", weight: 4 },
        ]
    },
    {
        question: "From the specified investment groups, you are most willing to invest in which investment group?",
        options: [
            { text: "\tA. Investment Group 1 offers a potential return of 2.5% without any possibility of loss.", weight: 1 },
            { text: "\tB. Investment Group 2 offers a maximum potential return of 7%, but there is a possibility of a loss of up to 1%.", weight: 2 },
            { text: "\tC. Investment Group 3 offers a maximum potential return of 15%, but there is a possibility of a loss of up to 5%.", weight: 3 },
            { text: "\tD. Investment Group 4 offers a maximum potential return of 25%, but there is a possibility of a loss of up to 15%.", weight: 4 },
        ]
    },
    {
        question: "How would you feel if you choose to invest in an asset with a high potential return but also a high risk of loss?",
        options: [
            { text: "\tA. Anxious and apprehensive about potential losses.", weight: 1 },
            { text: "\tB. Uncomfortable but somewhat understanding.", weight: 2 },
            { text: "\tC. Understand and accept a certain level of volatility.", weight: 3 },
            { text: "\tD. Not concerned about the high risk of loss and hopeful for potentially higher returns.", weight: 4 },
        ]
    },
    {
        question: "How would you feel uncomfortable or unable to accept if the value of your investment decreases by what percentage?",
        options: [
            { text: "\tA. 5% or less", weight: 1 },
            { text: "\tB. More than 5% to 10%", weight: 2 },
            { text: "\tC. More than 10% to 20%", weight: 3 },
            { text: "\tD. More than 20%", weight: 4 },
        ]
    },
    {
        question: "If last year you invested 100,000 baht and this year you find that the value of your investment has decreased to 85,000 baht, what would you do?",
        options: [
            { text: "\tA. Panic and want to sell off the remaining investment.", weight: 1 },
            { text: "\tB. Feel worried and consider reallocating some of the investment to less risky assets.", weight: 2 },
            { text: "\tC. Remain patient and wait for the investment returns to recover.", weight: 3 },
            { text: "\tD. Stay confident because you understand the need for long-term investments and plan to continue investing the same way to average out the cost.", weight: 4 },
        ]
    },
]
export default questions;