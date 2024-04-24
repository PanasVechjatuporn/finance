import React from "react";
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
    console.log('assetSummaryGoalData :: ',assetSummaryGoalData)
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
                Goal Investment Summary
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                    <caption>*The actual value may change depending on the buying/selling price that investors receive when buying/selling. Investors should check the price received and the latest price with the asset management company again</caption>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell align="center" colSpan={9}>
                                กองทุนรวม
                            </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell className="subHeader">
                                Fund name&nbsp;(Baht)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Fund type
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Amount&nbsp;
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Latest price<br/>&nbsp;(Baht/Unit)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Latest sell price&nbsp;(บาท/Unit)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Latest buy price&nbsp;(บาท/Unit)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Last update
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Net&nbsp;(Baht)
                            </StyledTableCell>
                            <StyledTableCell className="subHeader">
                                Note
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9}>
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
                                        <TableCell>{data.last_val}</TableCell>
                                        <TableCell>{data.sell_price}</TableCell>
                                        <TableCell>{data.buy_price}</TableCell>
                                        <TableCell>{new Date(data.last_upd_date).toLocaleDateString("en-GB")}</TableCell>
                                        <TableCell>{(roundNumber(data.value,6))}</TableCell>
                                        <TableCell>{data.sell_price === 0 ? "มูลค่าสุทธิที่ได้เกิดจากนำหน่วยลงทุนที่มีคูณมูลค่าล่าสุด" : "-"}</TableCell>
                                    </TableRow>)
                                )}
                            </>
                        ) 
                        : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">ไม่พบข้อมูล</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
