import React from 'react';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export default function ExpenseBenefitTable({ obj, open }) {
    return (
        Object.entries(obj).map(([Type, subtypeObj]) => (
            Object.entries(subtypeObj).map(([subtype, value]) => (
                <TableRow sx={{ '& > *': { borderBottom: 'none' } }} key={`${Type}.${subtype}`} >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table>
                                <TableBody>
                                    {Type == 0 ? (
                                        <TableRow >
                                            <TableCell style={{ width: "10%" }} />
                                            <TableCell align="left" style={{ width: "70%" }}>
                                                หักค่าใช้จ่ายประเภทที่ 1.0 และ 2.0
                                            </TableCell>
                                            <TableCell key={subtype} align="center" style={{ width: "20%" }}>
                                                {value}
                                            </TableCell>
                                        </TableRow>
                                    )
                                        : (
                                            <TableRow >
                                                <TableCell style={{ width: "10%" }} />
                                                <TableCell align="left" style={{ width: "70%" }}>
                                                    หักค่าใช้จ่ายประเภทที่ {Type}.{subtype}
                                                </TableCell>
                                                <TableCell key={subtype} align="center" style={{ width: "20%" }}>
                                                    {value}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            ))
        ))
    )
}