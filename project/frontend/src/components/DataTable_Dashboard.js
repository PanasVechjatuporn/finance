import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.date}
        </TableCell>
        <TableCell align="right">{row.sumOfIncome}</TableCell>
        <TableCell align="right">{row.sumOfInvestment}</TableCell>
        <TableCell align="right">{row.sumOfExpense}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {row.date}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center">Income</TableCell>
                    <TableCell align="center">Investment</TableCell>
                    <TableCell align="center">Expense</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {row.dropdown.map((dropdownColumns) => (
                    <TableRow key={dropdownColumns.date}>
                      <TableCell component="th" scope="row">
                        {dropdownColumns.date}
                      </TableCell>
                      <TableCell>{dropdownColumns.customerId}</TableCell>
                      <TableCell align="right">{dropdownColumns.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(dropdownColumns.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    sumOfIncome: PropTypes.number.isRequired,
    sumOfInvestment: PropTypes.number.isRequired,
    sumOfExpense: PropTypes.number.isRequired,
    dropdown: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

function digestDataFromStartDateEndDate(data, startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const dataArray = data.filter(obj => {
    const objDate = new Date(obj.date).getTime();
    return objDate >= start && objDate <= end;
  });
  let tmpArray = []
  dataArray.forEach(element => {
    let sumOfIncome = 0
    let sumOfInvestment = 0
    let sumOFExpense = parseFloat(element.expense.fixed_expense) + parseFloat(element.expense.variable_expense)
    element.income.forEach(obj => {
      sumOfIncome += parseFloat(obj.amount)
    })
    element.investment.forEach(obj => {
      sumOfInvestment += parseFloat(obj.amount)
    })
    tmpArray.push({
      'date': element.date,
      'sumOfIncome': sumOfIncome,
      'sumOfInvestment': sumOfInvestment,
      'sumOfExpense': sumOFExpense,
      'dropdown': [
        { 'income': [
          element.income
        ] },
        { 'investment': [
          element.investment
        ] },
        { 'expense': [
          element.expense
        ] }
      ]
    })
  })
  return tmpArray
}
export default function MonthDataTable({ data, startDate, endDate }) {
  const rows = digestDataFromStartDateEndDate(data, startDate, endDate)
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Month</TableCell>
            <TableCell align="right">Income</TableCell>
            <TableCell align="right">Investment</TableCell>
            <TableCell align="right">Expense</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.date} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}