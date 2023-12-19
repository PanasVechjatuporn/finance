import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { red, teal } from '@mui/material/colors';

const color_investment = teal['A700']
const color_fixed_exp = red[400]
const color_variable_exp = red[300]
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

    const percentInvest = (((sum_investment+ Number.EPSILON) / (sum_income+ Number.EPSILON)) * 100).toFixed(2)
    const percentFixedExpense = (((sum_fixed_expense+ Number.EPSILON) / (sum_income+ Number.EPSILON)) * 100).toFixed(2)
    const percentVariableExpense = (((sum_variable_expense+ Number.EPSILON) / (sum_income+ Number.EPSILON)) * 100).toFixed(2)

    data = [
        { label: 'Investment', value: percentInvest, color: color_investment },
        { label: 'Fixed Expense', value: percentFixedExpense, color: color_fixed_exp },
        { label: 'VariableExpense', value: percentVariableExpense, color: color_variable_exp },
    ];
    const size = {
        width: 600,
        height: 200,
    };
    return (
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${item.value} %`,
                        arcLabelMinAngle: 45,
                        data,
                    },
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontWeight: 'bold',
                        padding: '100px'
                    },
                }}
                slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                      padding: 60,
                    },
                  }}
                {...size}
            />
    )
}

export default Piechart
