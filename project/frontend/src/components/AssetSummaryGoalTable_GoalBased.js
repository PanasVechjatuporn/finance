import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    "&.dateCell": {
        backgroundColor: theme.palette.common.white,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export const AssetSummaryGoalTable = ({ selectedData }) => {
    if (selectedData) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell rowSpan={2}>
                                วันที่ซื้อ&nbsp;(วว/ดด/ปป)
                            </StyledTableCell>
                            <StyledTableCell>ชื่อกองทุน</StyledTableCell>
                            <StyledTableCell>จำนวนเงินที่ซื้อ&nbsp;(บาท)</StyledTableCell>
                            <StyledTableCell>ราคาที่ซื้อ&nbsp;(บาท)</StyledTableCell>
                            <StyledTableCell>จำนวนหน่วยที่ซื้อ</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {selectedData.assets.map((asset, index) => (
                            <React.Fragment key={index}>
                                <StyledTableRow>
                                    <StyledTableCell
                                        rowSpan={asset.Funds.length}
                                        className="dateCell"
                                    >
                                        {asset.CreatedDate}
                                    </StyledTableCell>
                                    {asset.Funds.length > 0 && (
                                        <React.Fragment>
                                            <StyledTableCell>
                                                {asset.Funds[0].fundName}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {asset.Funds[0].amount}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {asset.Funds[0].buyPrice}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                           {Math.round((asset.Funds[0].unit + Number.EPSILON)*100)/100}
                                            </StyledTableCell>
                                        </React.Fragment>
                                    )}
                                </StyledTableRow>
                                {asset.Funds.slice(1).map((fund, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{fund.fundName}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {fund.amount}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {fund.buyPrice}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {Math.round((fund.unit + Number.EPSILON) * 100) / 100}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
};
