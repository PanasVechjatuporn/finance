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
import { TabUnselected } from '@mui/icons-material';

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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={3}>Income</TableCell>
                    <TableCell align="center" colSpan={2}>Investment</TableCell>
                    <TableCell align="center" colSpan={2}>Expense</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    row.dropdown.map((dropdownColumns) => (
                      <React.Fragment key={dropdownColumns.name}>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">SubType</TableCell>
                            <TableCell align="center">Amount</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Amount</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Fixed Expense</TableCell>
                            <TableCell align="center">Variable Expense</TableCell>
                          </TableRow>
                        </TableHead>
                        {dropdownColumns.data.map((dataItem) => (
                          (dropdownColumns.name === "Income") ?
                            <Table align="left" stickyHeader aria-label="sticky table">

                              <TableBody>
                                <TableRow>
                                  {dataItem.map((dataEntry) => (
                                    <TableCell align="center">{dataEntry.type}</TableCell>
                                  ))}
                                </TableRow>
                                {dataItem.map((dataEntry) => (
                                  <TableCell align="center">{dataEntry.sub_type}</TableCell>
                                ))}
                                <TableRow>
                                  {dataItem.map((dataEntry) => (
                                    <TableCell align="center">{dataEntry.amount}</TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                            : (dropdownColumns.name === "Expense") ?
                              <Table align="left" stickyHeader aria-label="sticky table">
                                <TableBody>
                                  <TableRow>
                                    <TableCell align="center">{dataItem.fixed_expense}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell align="center">{dataItem.variable_expense}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              : <Table align="left" stickyHeader aria-label="sticky table">
                                <TableHead>

                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    {dataItem.map((dataEntry) => (
                                      <TableCell align="center">{dataEntry.name}</TableCell>
                                    ))}
                                    {dataItem.map((dataEntry) => (
                                      <TableCell align="center">{dataEntry.amount}</TableCell>
                                    ))}
                                  </TableRow>
                                </TableBody>
                              </Table>
                        ))}
                      </React.Fragment>
                    ))
                  }
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
      }),
    ).isRequired,
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
        {
          'name': 'Income',
          'data': [
            element.income
          ]
        },
        {
          'name': 'Investment',
          'data': [
            element.investment
          ]
        },
        {
          'name': 'Expense',
          'data': [
            element.expense
          ]
        }
      ]
    })
  })
  console.log(tmpArray)
  return tmpArray
}
export default function MonthDataTable({ data, startDate, endDate }) {
  const rows = digestDataFromStartDateEndDate(data, startDate, endDate)
  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer >
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
    </Paper>
  );
}