import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
export const Piechart = ({ data, startDate, endDate }) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const dataArray = data.filter(obj => {
        const objDate = new Date(obj.date).getTime();
        return objDate >= start && objDate <= end;
    });
    const sumIncome = dataArray.reduce((sum, obj) => sum + parseInt(obj.income), 0);
    const sumInvest = dataArray.reduce((sum, obj) => sum + parseInt(obj.investment), 0);
    const sumFixedExpense = dataArray.reduce((sum, obj) => sum + parseInt(obj.expense.fixed_expense), 0);
    const sumVariableExpense = dataArray.reduce((sum, obj) => sum + parseInt(obj.expense.variable_expense), 0);

    const percentInvest = Math.round((sumInvest / sumIncome) * 100)
    const percentFixedExpense = Math.round((sumFixedExpense / sumIncome) * 100)
    const percentVariableExpense = Math.round((sumVariableExpense / sumIncome) * 100)

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
            <p>{startDate}</p>
            <p>{endDate}</p>
        </div>
    )
}

export default Piechart
