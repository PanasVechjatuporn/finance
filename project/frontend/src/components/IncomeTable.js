import React from 'react';
import PropTypes from 'prop-types';
import { Container } from "react-bootstrap";
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
import Navigate from "components/Navbar";
import TextField from '@mui/material/TextField';
import data from "mockupData/mockData.json";

export default function IncomeTable({ sumByType, open }) {
    return (
        Object.entries(sumByType).map(([Type, subtypeObj]) => (
            Object.entries(subtypeObj).map(([subtype, value]) => (
                <TableRow sx={{ '& > *': { borderBottom: 'none' } }} >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table>
                                <TableRow >
                                    <TableCell style={{ width: "10%" }} />
                                    <TableCell align="left" style={{ width: "70%" }}>
                                        ประเภทที่ {Type}.{subtype}
                                    </TableCell>
                                    <TableCell key={subtype} align="left" style={{ width: "20%" }}>
                                        {value}
                                    </TableCell>
                                </TableRow>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            ))
        ))
    )
}