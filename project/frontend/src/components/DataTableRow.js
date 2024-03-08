import React, { useState } from "react";
import { Table, TableHead } from "@mui/material";
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import EditMonthDataModal from "./editMonthDataModal";
function digestMonthDataParent(monthData){ //head of each month (outside)
    let sumIncome = 0
    monthData.income.forEach(element => {
        sumIncome += parseFloat(element.amount)
    });
    const result = {
        income : sumIncome
    }
    return result
}

export const DataTableRow = (dataMonth) => {
    const [openModal, setOpenModal] = useState(false);
    const handleEditClick = () => {
        openModal ? setOpenModal(false) : setOpenModal(true)
    };
    const [open, setOpen] = React.useState(false);
    const monthData = dataMonth.dataMonth
    const headerData = digestMonthDataParent(monthData)
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
                <TableCell>
                    <IconButton children={<EditIcon></EditIcon>} onClick={(e) => {handleEditClick()}}></IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {monthData.date}
                </TableCell>
                <TableCell align="center">
                    {headerData.income}
                </TableCell>
                <TableCell align="center">
                    {/* {row.sumOfInvestment} */}
                </TableCell>
                <TableCell align="center">
                    {/* {row.sumOfExpense} */}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {/* {row.date} */}
                            </Typography>
                            <div style={{ display: 'flex' }}>
                                {/* Sub Tabel Income, Investment, Expense */}
                                <Table className='sub-table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={3} style={{ fontSize: '12pt' }}>Income</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">Type</TableCell>
                                            <TableCell align="center">SubType</TableCell>
                                            <TableCell align="center">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    
                                </Table>
                                <Table className='sub-table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2} style={{ fontSize: '12pt' }}>Investment</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">Name</TableCell>
                                            <TableCell align="center">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    
                                </Table>
                                <Table className='sub-table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2} style={{ fontSize: '12pt' }}>Expense</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">Fixed Expense</TableCell>
                                            <TableCell align="center">Variable Expense</TableCell>
                                        </TableRow>
                                    </TableHead>

                                </Table>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <EditMonthDataModal show={openModal} clickedMonth={monthData} onClose={handleEditClick} mode="editexisting"></EditMonthDataModal>
        </React.Fragment>
    );
}