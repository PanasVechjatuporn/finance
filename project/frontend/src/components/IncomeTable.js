import React from 'react';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export default function IncomeTable({ obj, open }) {
    const incomeType = {
        '0': {
            '0': 'Type 40(1) Salary และ 40(2) General Wages'
        },
        '1': {
            '0': 'Type 40(1) Salary'
        },
        '2': {
            '0': 'Type 40(2) General Wages'
        },
        '3': {
            '1': 'Type 40(3) Royalty fees/Royalty and intellectual property fees/Goodwill fees',
            '2': 'Type 40(3) Annuities and annuities from legal acts or court judgments'
        },
        '4': {
            '0': 'Type 40(4) Interest/dividends/investment benefits'
        },
        '5': {
            '1': 'Type 40(5) Rent of a house or other building',
            '2': 'Type 40(5) Rent for land used for agriculture',
            '3': 'Type 40(5) Rent for land not used for agriculture',
            '4': 'Type 40(5) Vehicle rental',
            '5': 'Type 40(5) Other property rental fees',
            '6': 'Type 40(5) Income from people breaking their contract to buy/sell installment payments.'
        },
        '6': {
            '1': 'Type 40(6) Independent professional practice by practicing the art',
            '2': 'Type 40(6) Independent professional practice that is not an art'
        },
        '7': {
            '0': 'Type 40(6) Contractor costs both labor and goods'
        }
    };

    function renderIncome(Type, subtype) {
        if (incomeType[Type] && incomeType[Type][subtype]) {
            return incomeType[Type][subtype]
        }
    }
    return (
        Object.entries(obj).map(([Type, subtypeObj]) => (
            Object.entries(subtypeObj).map(([subtype, value]) => (
                <TableRow sx={{ '& > *': { borderBottom: 'none' } }} key={`${Type}.${subtype}`} >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table>
                                <TableBody>
                                    <TableRow >
                                        <TableCell style={{ width: "10%" }} />

                                        <TableCell align="left" style={{ width: "70%" }}>
                                            {renderIncome(Type, subtype)}
                                        </TableCell>

                                        <TableCell key={subtype} align="center" style={{ width: "20%" }}>
                                            {value.toLocaleString("en-GB")}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            ))
        ))
    )
}