const jsonData = [
    {
      date: "2023-10",
      income: [
        { type: "1", sub_type: "1", amount: "25000" }
      ],
      expense: { fixed_expense: "9000", variable_expense: "10000" },
      investment: [
        { name: "A", amount: "4000" },
        { name: "C", amount: "2000" }
      ]
    },
    {
      date: "2023-11",
      income: [
        { type: "1", sub_type: "1", amount: "30000" },
        { type: "2", sub_type: "1", amount: "5000" }
      ],
      expense: { fixed_expense: "9500", variable_expense: "11000" },
      investment: [
        { name: "B", amount: "4500" },
        { name: "A", amount: "5000" }
      ]
    }
  ];

console.log(String(jsonData.reduce((sum, record) => sum + parseInt(record.expense.variable_expense), 0)));

  jsonData.forEach(record => {
    const month = record.date;
    const incomeList = record.income;
  
    // Calculate the sum of amounts for the month
    const totalAmount = incomeList.reduce((sum, income) => sum + parseInt(income.amount), 0);
  
    // Display the results
    console.log(`Month: ${month}, Total Income: ${totalAmount}`);
  });