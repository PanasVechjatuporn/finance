import React from 'react';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export default function IncomeTable({ obj, open }) {
    const incomeType = {
        '1': {
            '0': 'ประเภท 40(1) เงินเดือน'
        },
        '2': {
            '0': 'ประเภท 40(2) ค่าจ้างทั่วไป'
        },
        '3': {
            '1': 'ประเภท 40(3) ค่าลิขสิทธิ์/ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา/ค่าGoodwill',
            '2': 'ประเภท 40(3) เงินปีและเงินรายปีจากนิติกรรมหรือคำพิพากษาของศาล'
        },
        '4': {
            '0': 'ประเภท 40(4) ดอกเบี้ย/เงินปันผล/ผลประโยชน์จากการลงทุน'
        },
        '5': {
            '1': 'ประเภท 40(5) ค่าเช่าบ้านหรือสิ่งปลูกสร้างอื่น',
            '2': 'ประเภท 40(5) ค่าเช่าที่ดินที่ใช้ในการเกษตรกรรม',
            '3': 'ประเภท 40(5) ค่าเช่าที่ดินที่ไม่ได้ใช้ในการเกษตรกรรม',
            '4': 'ประเภท 40(5) ค่าเช่ายานพาหนะ',
            '5': 'ประเภท 40(5) ค่าเช่าทรัพย์สินอื่นๆ',
            '6': 'ประเภท 40(5) รายได้จากการที่มีคนผิดสัญญาเช้าซื้อ/ซื้อขายเงินผ่อน'
        },
        '6': {
            '1': 'ประเภท 40(6) การประกอบวิชาชีพอิสระ โดยประกอบโรคศิลปะ',
            '2': 'ประเภท 40(6) การประกอบวิชาชีพอิสระ ที่ไม่ใช่การประกอบโรคศิลปะ'
        },
        '7': {
            '0': 'ประเภท 40(7) ค่ารับเหมาทั้งค่าแรงและค่าของ'
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