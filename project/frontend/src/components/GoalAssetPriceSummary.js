import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { roundNumber } from "utils/numberUtil";
import Typography from "@mui/material/Typography";
import { ComponentLoading } from "./OverlayLoading";
import { useSelector } from "react-redux";
import axios from "axios";
const baseURL = "http://localhost:8000";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#3e5074",
        color: "white",
        borderStyle: "hidden !important",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    "&.dateCell": {
        backgroundColor: theme.palette.common.white,
    },
    "&.subHeader": {
        backgroundColor: "#7a8fb8",
        color: "white",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:last-child td, &:last-child th": {
        borderStyle: "hidden !important",
    },
}));



export const GoalAssetPriceSummary = ({ isLoading, assetSummaryGoalData }) => {

    return (
        <Container>
            <Typography
                variant="h5"
                style={{
                    color: "#757575",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    borderBottom: "2px solid #757575",
                    display: "inline-block",
                    width: "100%",
                    paddingBottom: "8px",
                    userSelect: "none",
                    marginBottom: "15px",
                    fontWeight: "bold",
                }}
            >
                สรุปการลงทุนภายในเป้าหมาย
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                    <caption>*มูลค่าจริงอาจมีการเปลี่ยนแปลงโดยขึ้นกับราคา ซื้อ/ขาย ที่ผู้ลงทุนได้รับเมื่อทำการ ซื้อ/ขาย โดยผู้ลงทุนควรตรวจสอบราคาที่ได้รับและราคาล่าสุดกับ บลจ. อีกครั้ง</caption>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell align="center" colSpan={6}>
                                กองทุนรวม
                            </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell className="subHeader">
                                ชื่อกองทุน&nbsp;(ไทย)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                ประเภทของกองทุน
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                จำนวนหน่วยลงทุน&nbsp;(หน่วย)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                ราคาปัจจุบัน&nbsp;(บาท)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                อัปเดตราคาล่าสุด
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                มูลค่า&nbsp;(บาท)
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <ComponentLoading isLoading={isLoading} size={"300px"} />
                                </TableCell>
                            </TableRow>
                        ) : assetSummaryGoalData && assetSummaryGoalData.length > 0 ? (
                            <>
                                {assetSummaryGoalData.map((data, index) => (
                                    <TableRow key={data.nav_date+"-"+index}>
                                        <TableCell>{data.fundName}</TableCell>
                                        <TableCell>{data.spec_code}</TableCell>
                                        <TableCell>{data.unit}</TableCell>
                                        <TableCell>{data.lastestNav}</TableCell>
                                        <TableCell>{new Date(data.nav_date).toLocaleDateString("en-GB")}</TableCell>
                                        <TableCell>{(roundNumber(data.value,6))}</TableCell>
                                    </TableRow>)
                                )}
                            </>
                        ) 
                        : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">ไม่พบข้อมูล</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
