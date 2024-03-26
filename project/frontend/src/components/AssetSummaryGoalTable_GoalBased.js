import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatNumberWithCommas, roundNumber } from "utils/numberUtil";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#3e5074",
        color: "white",
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
                            <StyledTableCell>วันที่ซื้อ&nbsp;(วว/ดด/ปป)</StyledTableCell>
                            <StyledTableCell align="center" colSpan={6}>
                                สินทรัพย์ที่ลงทุน
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {selectedData.assets.map((asset, index) => (
                                <React.Fragment
                                    key={asset.CreatedDate + "-" + index + "-fragment"}
                                >
                                    <StyledTableRow
                                        key={asset.CreatedDate + "-" + index + "-header"}
                                    >
                                        <StyledTableCell rowSpan={asset.Funds.length + 1}>
                                            {asset.CreatedDate}
                                        </StyledTableCell>
                                        <StyledTableCell className="subHeader">
                                            ประเภทของสินทรัพย์ที่ลงทุน
                                        </StyledTableCell>
                                        <StyledTableCell className="subHeader">
                                            ชื่อกองทุน
                                        </StyledTableCell>
                                        <StyledTableCell className="subHeader">
                                            จำนวนเงินที่ซื้อ&nbsp;(บาท)
                                        </StyledTableCell>
                                        <StyledTableCell className="subHeader">
                                            ราคาที่ซื้อ&nbsp;(บาท)
                                        </StyledTableCell>
                                        <StyledTableCell className="subHeader">
                                            จำนวนหน่วยที่ซื้อ
                                        </StyledTableCell>
                                        <StyledTableCell className="subHeader">
                                            ประเภทของกองทุน
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    {asset.Funds.map((subAsset, indexSubAsset) => (
                                        <StyledTableRow
                                            key={
                                                asset.CreatedDate +
                                                "-" +
                                                index +
                                                "-body-" +
                                                subAsset.fundName
                                            }
                                        >
                                            <StyledTableCell>
                                                {subAsset.assetType === "deposit"
                                                    ? "เงินฝากประจำ"
                                                    : subAsset.assetType === "rmf"
                                                        ? "กองทุนรวม RMF"
                                                        : subAsset.assetType === "ssf"
                                                            ? "กองทุนรวม SSF"
                                                            : "กองทุนที่ไม่มีมีสิทธิประโยชน์ทางภาษี"}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align={subAsset.assetType === "deposit" ? "center" : "left"}
                                            >
                                                {subAsset.fundName && subAsset.assetType !== "deposit"
                                                    ? subAsset.fundName
                                                    : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {formatNumberWithCommas(subAsset.amount)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {subAsset.buyPrice ? subAsset.buyPrice : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {subAsset.buyPrice && subAsset.buyPrice !== 0
                                                    ? roundNumber(subAsset.unit, 2)
                                                    : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {subAsset.spec_code ? subAsset.spec_code : "-"}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
};
