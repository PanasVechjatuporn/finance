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
import "components/DataTable_Dashboard.css";

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
        <TableCell align="center">{row.sumOfIncome}</TableCell>
        <TableCell align="center">{row.sumOfInvestment}</TableCell>
        <TableCell align="center">{row.sumOfExpense}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {row.date}
              </Typography>
              <div style={{ display : 'flex'}}>
                {/* Sub Tabel Income, Investment, Expense */}
                <Table className='sub-table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={3} style={{fontSize: '12pt'}}>Income</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">SubType</TableCell>
                      <TableCell align="center">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  {
                    row.dropdown.map((dropdownColumn) => (
                      <React.Fragment key={dropdownColumn.name + row.date}>
                        {dropdownColumn.data.map((dataItem) => (
                          (dropdownColumn.name === "Income") ?
                            <React.Fragment key={dropdownColumn.name + row.date + row.sumOfIncome}>
                              {
                                dataItem.map((dataEntry) => (
                                  <TableRow>
                                    <TableCell align="center">{dataEntry.type}</TableCell>
                                    <TableCell align="center">{dataEntry.sub_type}</TableCell>
                                    <TableCell align="center">{dataEntry.amount}</TableCell>
                                  </TableRow>
                                ))
                              }
                            </React.Fragment>
                            : <></>
                        ))}
                      </React.Fragment>
                    ))
                  }
                </Table>

                <Table className='sub-table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={2} style={{fontSize: '12pt'}}>Investment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  {
                    row.dropdown.map((dropdownColumn) => (
                      <React.Fragment key={dropdownColumn.name + row.date}>
                        {dropdownColumn.data.map((dataItem) => (
                          (dropdownColumn.name === "Investment") ?
                            <React.Fragment key={dropdownColumn.name + row.date + row.sumOfInvestment}>
                              {
                                dataItem.map((dataEntry) => (
                                  <TableRow>
                                    <TableCell align="center">{dataEntry.name}</TableCell>
                                    <TableCell align="center">{dataEntry.amount}</TableCell>
                                  </TableRow>
                                ))
                              }
                            </React.Fragment>
                            : <></>
                        ))}
                      </React.Fragment>
                    ))
                  }
                </Table>

                <Table className='sub-table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={2} style={{fontSize: '12pt'}}>Expense</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Fixed Expense</TableCell>
                      <TableCell align="center">Variable Expense</TableCell>
                    </TableRow>
                  </TableHead>
                  {
                    row.dropdown.map((dropdownColumn) => (
                      <React.Fragment key={dropdownColumn.name + row.date}>
                        {dropdownColumn.data.map((dataItem) => (
                          (dropdownColumn.name === "Expense") ?
                            <React.Fragment key={dropdownColumn.name + row.date + row.sumOfExpense}>
                              {
                                <TableRow>
                                  <TableCell align="center">{dataItem.fixed_expense}</TableCell>
                                  <TableCell align="center">{dataItem.variable_expense}</TableCell>
                                </TableRow>
                              }
                            </React.Fragment>
                            : <></>
                        ))}
                      </React.Fragment>
                    ))
                  }
                </Table>
              </div>
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
  return tmpArray
}

export default function MonthDataTable({ data, startDate, endDate }) {
  const rows = digestDataFromStartDateEndDate(data, startDate, endDate)
  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer >
        <Table aria-label="collapsible table" className='main-table'>
          <TableHead>
            <TableRow align="center">
              <TableCell/>
              <TableCell style={{fontSize: '15pt'}}>Month</TableCell>
              <TableCell align="center" style={{fontSize: '15pt'}}>Income</TableCell>
              <TableCell align="center" style={{fontSize: '15pt'}}>Investment</TableCell>
              <TableCell align="center" style={{fontSize: '15pt'}}>Expense</TableCell>
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