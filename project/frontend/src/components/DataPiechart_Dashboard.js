import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
export const Piechart = ({ data, startDate, endDate }) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const dataArray = data.filter(obj => {
        const objDate = new Date(obj.date).getTime();
        return objDate >= start && objDate <= end;
    });

    let sum_income = 0;
    let sum_investment = 0;
    let sum_fixed_expense = dataArray.reduce((sum, record) => sum + parseInt(record.expense.fixed_expense), 0);
    let sum_variable_expense = dataArray.reduce((sum, record) => sum + parseInt(record.expense.variable_expense), 0);
    
    dataArray.forEach(record => {
        const income_list = record.income;
        const investment_list = record.investment;        
        
        sum_income += parseInt(income_list.reduce((sum, income) => sum + parseInt(income.amount),0));
        sum_investment += parseInt(investment_list.reduce((sum, investment) => sum + parseInt(investment.amount),0));
        
    });

    const percentInvest = Math.round((sum_investment / sum_income) * 100)
    const percentFixedExpense = Math.round((sum_fixed_expense / sum_income) * 100)
    const percentVariableExpense = Math.round((sum_variable_expense / sum_income) * 100)

    data = [
        { 'value': percentInvest, 'label': 'Investment' },
        { 'value': percentFixedExpense, 'label': 'Fixed Expense' },
        { 'value': percentVariableExpense, 'label': 'VariableExpense' },
    ];
    const size = {
        width: 400,
        height: 200,
    };
    return (
        <div>
            <h1>Piechart</h1>
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${item.label} (${item.value})`,
                        arcLabelMinAngle: 45,
                        data,
                    },
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontWeight: 'bold',
                    },
                }}
                {...size}
            />
            {/* <p>{startDate}</p>
            <p>{endDate}</p> */}
        </div>
    )
}

export default Piechart
