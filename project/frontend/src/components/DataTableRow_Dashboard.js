import React, { useEffect, useState } from "react";
import { Table, TableBody, TableHead } from "@mui/material";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import EditMonthDataModal from "./EditMonthDataModal_Dashboard";
import DeleteIcon from '@mui/icons-material/Delete';
const taxableIncome = [
    {
        name: "เงินได้ประเภทที่ 1",
        category: 1,
        label: "เงินเดือน",
    },
    {
        name: "เงินได้ประเภทที่ 2",
        category: 2,
        label: "ค่าจ้างทั่วไป",
    },
    {
        name: "เงินได้ประเภทที่ 3",
        category: 3,
        label: "ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา",
        subcategory: [
            {
                subcategorylabel:
                    "ค่าลิขสิทธิ์/ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา/ค่าGoodwill",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 50% แต่ไม่เกิน 100,000 บาท หรือหักตามจริง",
            },
            {
                subcategorylabel: "เงินปีและเงินรายปีจากนิติกรรมหรือคำพิพากษาของศาล",
                subcategorycategory: 2,
                subcategoryinfo: "-",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 4",
        category: 4,
        label: "ดอกเบี้ย/เงินปันผล/ผลประโยชน์จากการลงทุน",
    },
    {
        name: "เงินได้ประเภทที่ 5",
        category: 5,
        label: "เงินได้จากการให้เช่าทรัพย์สิน",
        subcategory: [
            {
                subcategorylabel: "ค่าเช่าบ้าน/อาคาร/ตึก/สิ่งปลูกสร้าง/แพ",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าที่ดินเกษตรกรรม",
                subcategorycategory: 2,
                subcategoryinfo: "หักแบบเหมา 20% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าที่ดินไม่ใช้ในเกษตรกรรม",
                subcategorycategory: 3,
                subcategoryinfo: "หักแบบเหมา 15% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่ายานพาหนะ",
                subcategorycategory: 4,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าอื่นๆ",
                subcategorycategory: 5,
                subcategoryinfo: "หักแบบเหมา 10% หรือหักตามจริง",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 6",
        category: 6,
        label: "เงินได้จากวิชาชีพอิสระ",
        subcategory: [
            {
                subcategorylabel: "การประกอบโรคศิลปะ",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 60% หรือหักตามจริง",
            },
            {
                subcategorylabel: "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/บัญชี/ประณีตศิลปกรรม",
                subcategorycategory: 2,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 7",
        category: 7,
        label: "เงินได้จากการรับเหมา (ก่อสร้าง/รับผลิตสินค้า)",
    },
];

const expenseType = [
    {
        name: "รายจ่าย tmp 1",
        category: 1,
    },
    {
        name: "รายจ่าย tmp 2",
        category: 2,
    },
    {
        name: "รายจ่าย tmp 3",
        category: 3,
    },
    {
        name: "รายจ่าย tmp 4",
        category: 4,
    },
    {
        name: "รายจ่าย tmp 5",
        category: 5,
    },
    {
        name: "รายจ่าย tmp 6",
        category: 6,
    },
    {
        name: "รายจ่าย tmp 7",
        category: 7,
    },
    {
        name: "อื่นๆ",
        category: 8,
    },
];

export const DataTableRow = ({
    dataMonth,
    userData,
    setUserData,
    selectedYear,
    isDeleteActive
}) => {
    const [openModal, setOpenModal] = useState(false);
    const handleEditClick = () => {
        openModal ? setOpenModal(false) : setOpenModal(true);
    };
    const [open, setOpen] = React.useState(false);
    const tmp = 0;

    const onClickDelete = (e) => {
        console.log('e :: ',e)
    }
    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
                    <IconButton
                        children={<EditIcon></EditIcon>}
                        onClick={(e) => {
                            handleEditClick();
                        }}
                    ></IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {new Date(dataMonth.date).toLocaleString("en-us", {
                        month: "long",
                    })}
                </TableCell>
                <TableCell align="center">
                    {dataMonth.incomeData.reduce(
                        (sum, current) => parseFloat(sum) + parseFloat(current.amount),
                        tmp
                    )}
                </TableCell>
                <TableCell align="center">
                    {dataMonth.expenseData.reduce(
                        (sum, current) => parseFloat(sum) + parseFloat(current.amount),
                        tmp
                    )}
                </TableCell>
                <TableCell align="center">{dataMonth.investmentData}</TableCell>

                {/* delete button */}
                <TableCell align="center">
                    <>
                    {
                        isDeleteActive ? (<IconButton
                            children={<DeleteIcon style={{color : 'red'}}></DeleteIcon>}
                            onClick={(e) => {
                                onClickDelete(e)
                            }}
                        ></IconButton>) : (<DeleteIcon style={{ color: 'grey' }} />)
                    }
                    </>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/* <Typography variant="h6" gutterBottom component="div">
                                {row.date}
                            </Typography> */}
                            <div style={{ display: "flex" }}>
                                {/* Sub Tabel Income, Investment, Expense */}
                                <Table className="sub-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={3}
                                                style={{ fontSize: "12pt" }}
                                                sx={{
                                                    backgroundColor: '#CBFFA9',
                                                  }}
                                            >
                                                Income
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">Amount</TableCell>
                                            <TableCell align="center">Type</TableCell>
                                            <TableCell align="center">Subtype</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            (dataMonth.incomeData.map((item, index) => 
                                                (<TableRow>
                                                    <TableCell key={item.amount+index} align="center">{item.amount}</TableCell>
                                                    <TableCell key={item.type+index} align="center">{item.type}</TableCell>
                                                    <TableCell key={item.amount+Math.random(10,10)} align="center">null</TableCell>
                                                </TableRow>)
                                            )) 
                                        }
                                    </TableBody>
                                </Table>
                                <Table className="sub-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={2}
                                                style={{ fontSize: "12pt" }}
                                                sx={{
                                                    backgroundColor: '#FF9B9B',
                                                  }}
                                            >
                                                Expense
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">Amount</TableCell>
                                            <TableCell align="center">Type</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            (dataMonth.expenseData.map((item, index) => 
                                                (<TableRow>
                                                    <TableCell key={item.amount+index} align="center">{item.amount}</TableCell>
                                                    <TableCell key={item.type+index} align="center">{item.type}</TableCell>
                                                </TableRow>)
                                            )) 
                                        }
                                    </TableBody>
                                </Table>
                                <Table className="sub-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={2}
                                                style={{ fontSize: "12pt" }}
                                                sx={{
                                                    backgroundColor: '#FFFEC4',
                                                  }}
                                            >
                                                Investment
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" key={Math.random(10,10)}>Amount</TableCell>
                                            <TableCell align="center" key={Math.random(10,10)}>Unit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                    </TableBody>
                                </Table>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <EditMonthDataModal
                show={openModal}
                dataMonth={dataMonth}
                onClose={handleEditClick}
                mode="editexisting"
                userData={userData}
                setUserData={setUserData}
                selectedYear={selectedYear}
            ></EditMonthDataModal>
        </React.Fragment>
    );
};
