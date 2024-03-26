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
import { formatNumberWithCommas, roundNumber } from "utils/numberUtil";
import Typography from "@mui/material/Typography";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#3e5074",
        color: "white",
        borderStyle: "hidden !important"
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
    // "&:nth-of-type(even)": {
    //     backgroundColor: theme.palette.action.hover,
    // },
    "&:last-child td, &:last-child th": {
        borderStyle: "hidden !important"
    },
}));

export const AssetSummaryGoalTable = ({ selectedData }) => {
    if (selectedData) {
        console.log('selectedData.assets :: ',selectedData.assets.length)
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
                            fontWeight: "bold"
                        }}
                    >
                        ตารางแสดงการลงทุนภายในเป้าหมาย {selectedData.Name}
                    </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell rowSpan={2}>วันที่ซื้อ&nbsp;(วว/ดด/ปป)</StyledTableCell>
                                <StyledTableCell align="center" colSpan={6}>
                                    สินทรัพย์ที่ลงทุน
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
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
                                    จำนวนหน่วยลงทุน
                                </StyledTableCell>
                                <StyledTableCell className="subHeader">
                                    ประเภทของกองทุน
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {selectedData.assets.length > 0 ? (<>
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
                                                    align={
                                                        subAsset.assetType === "deposit" ? "center" : "left"
                                                    }
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
                            </>) : (<TableRow>
                                <TableCell colSpan={7} align="center">ไม่พบข้อมูล</TableCell>
                            </TableRow>)}
                            
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        );
    }
};
