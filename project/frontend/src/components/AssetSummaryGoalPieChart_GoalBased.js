import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { formatNumberWithCommas, roundNumber } from "utils/numberUtil";
import Typography from "@mui/material/Typography";

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
    "&:nth-of-type(even)": {
        backgroundColor: theme.palette.action.hover,
    },
    // "&:last-child td, &:last-child th": {
    //     borderStyle: "hidden !important",
    // },
}));

export const AssetSummaryGoalPieChart = ({ assetData }) => {
    const [allFundsObj, setAllFundsObj] = useState([]);
    useEffect(() => {
        let tmpObjArray = [];
        if(assetData){
            assetData.forEach((asset) => {
                asset.Funds.forEach((eachFunds) => {
                    let existingFund = tmpObjArray.find(
                        (obj) => obj.fundName === eachFunds.fundName
                    );
                    if (!existingFund) {
                        if (eachFunds.assetType === "deposit") {
                            tmpObjArray.push({
                                fundName: eachFunds.fundName,
                                amount: parseFloat(eachFunds.amount),
                                proj_id: null,
                                buyPrice: null,
                                unit: null,
                                spec_code: null,
                                assetType: eachFunds.assetType,
                            });
                        } else {
                            tmpObjArray.push({
                                fundName: eachFunds.fundName,
                                amount: null,
                                proj_id: eachFunds.proj_id,
                                buyPrice: eachFunds.buyPrice,
                                unit: parseFloat(eachFunds.unit),
                                spec_code: eachFunds.spec_code,
                                assetType: eachFunds.assetType,
                            });
                        }
                    } else {
                        if (eachFunds.assetType === "deposit") {
                            existingFund.amount += parseFloat(eachFunds.amount);
                        } else {
                            existingFund.unit += parseFloat(eachFunds.unit);
                        }
                    }
                });
            });
        }
        setAllFundsObj(tmpObjArray);
    }, [assetData]);

        return (
            <Container>

                <div>
                    <Typography
                        variant="h5"
                        style={{
                            color: "#757575",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            borderBottom: "2px solid #757575",
                            width: "100%",
                            paddingBottom: "8px",
                            userSelect: "none",
                            marginBottom: "15px",
                            fontWeight: "bold",
                        }}
                    >
                        Fund Investment Summary
                    </Typography>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Fund name</StyledTableCell>
                                <StyledTableCell>Asset type</StyledTableCell>
                                <StyledTableCell>Units</StyledTableCell>
                                <StyledTableCell>Fund type</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {allFundsObj.length > 0 ? (<>{allFundsObj.map(
                                (asset, index) =>
                                    asset.assetType !== "deposit" && (
                                        <StyledTableRow
                                            key={asset.assetType + "-row-data-" + index}
                                        >
                                            <StyledTableCell
                                                align={
                                                    asset.assetType === "deposit" ? "center" : "left"
                                                }
                                            >
                                                {asset.fundName && asset.assetType !== "deposit"
                                                    ? asset.fundName
                                                    : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {asset.assetType === "deposit"
                                                    ? "เงินฝากประจำ"
                                                    : asset.assetType === "rmf"
                                                        ? "กองทุนรวม RMF"
                                                        : asset.assetType === "ssf"
                                                            ? "กองทุนรวม SSF"
                                                            : "กองทุนที่ไม่มีมีสิทธิประโยชน์ทางภาษี"}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {asset.buyPrice && asset.buyPrice !== 0
                                                    ? roundNumber(asset.unit, 2)
                                                    : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {asset.spec_code ? asset.spec_code : "-"}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )
                            )}</>) : (<TableCell colSpan={4} align="center">
                                No data found
                            </TableCell>)}

                        </TableBody>
                    </Table>
                </TableContainer>

                {/* <div>
                    <Typography
                        variant="h5"
                        style={{
                            color: "#757575",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            borderBottom: "2px solid #757575",
                            width: "100%",
                            paddingBottom: "8px",
                            userSelect: "none",
                            marginBottom: "15px",
                            fontWeight: "bold",
                            marginTop: "5%"
                        }}
                    >
                        สรุปเงินฝากทั้งหมด
                    </Typography>
                </div> */}
                {/* <TableContainer component={Paper} >
                    <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>ประเภทของสินทรัพย์ที่ลงทุน</StyledTableCell>
                                <StyledTableCell>จำนวนเงินที่ซื้อ&nbsp;(Baht)</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {allFundsObj.length > 0 ? (
                                <>
                                    {allFundsObj.map(
                                        (asset, index) =>
                                            asset.assetType === "deposit" && (
                                                <StyledTableRow
                                                    key={asset.assetType + "-row-data-" + index}
                                                >
                                                    <StyledTableCell>
                                                        {asset.assetType === "deposit"
                                                            ? "เงินฝากประจำ"
                                                            : asset.assetType === "rmf"
                                                                ? "กองทุนรวม RMF"
                                                                : asset.assetType === "ssf"
                                                                    ? "กองทุนรวม SSF"
                                                                    : "กองทุนที่ไม่มีมีสิทธิประโยชน์ทางภาษี"}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {formatNumberWithCommas(asset.amount)}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            )
                                    )}
                                </>
                            ) : (
                                <TableCell colSpan={2} align="center">
                                    ไม่พบข้อมูล
                                </TableCell>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer> */}
            </Container>
        );
};
