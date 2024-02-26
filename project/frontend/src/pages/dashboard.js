import React, { useState } from "react";
import Navigate from "components/Navbar";
import mockData from "mockupData/mockData.json";
import { useSelector } from "react-redux";
import Piechart from "components/DataPiechart_Dashboard";
import MonthDataTable from "components/DataTable_Dashboard";
import SelectionFields from "components/DataSelectionFields_Dashboard";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Card, Nav } from "react-bootstrap";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Icon } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
let data = mockData;
export const Dashboard = () => {
    const userStore = useSelector(state => state.userStore)
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            <Navigate />
            <Container >
                <Box style={{ marginTop: "5%" }}>
                    <Paper >
                        <TableContainer style={{ height: "70vh" }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "1vh" }}></TableCell>
                                        <TableCell style={{ width: "1vh" }}></TableCell>
                                        <TableCell align="center" style={{ width: "10vh" }}>Month</TableCell>
                                        <TableCell align="center">Income</TableCell>
                                        <TableCell align="center">Investment</TableCell>
                                        <TableCell align="center">Expense</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableCell align="center">
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => setOpen(!open)}
                                        >
                                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center"><IconButton children={<EditIcon></EditIcon>}></IconButton></TableCell>
                                    <TableCell align="center">Month</TableCell>
                                    <TableCell align="center">Month</TableCell>
                                    <TableCell align="center">Month</TableCell>
                                    <TableCell align="center">Month</TableCell>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch />}
                        label="Dense padding"
                    />
                </Box>
            </Container>
        </React.Fragment >
    );
};
export default Dashboard;
