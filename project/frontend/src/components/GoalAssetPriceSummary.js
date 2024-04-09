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

async function fetchGoalAsset(goalData, userStore) {
    try {
        const res = await axios.get(`${baseURL}/db/get_user_asset_by_goal_id`, {
            headers: {
                userId: userStore.userId,
                Authorization: userStore.userToken,
                goalObjId: goalData._id,
            },
        });
        return res.data;
    } catch (err) {
        console.log("err :: ", err);
    }
}

async function fetchLastestPrice(assetsData, userStore) {
    try {
        const res = await axios.post(
            `${baseURL}/db/get_goal_asset_lastest_price`,
            {
                assetsData: assetsData,
            },
            {
                headers: {
                    userId: userStore.userId,
                    Authorization: userStore.userToken,
                },
            }
        );
        return res.data;
    } catch (err) {
        console.log("err :: ", err);
    }
}

export const GoalAssetPriceSummary = ({ goalData }) => {
    const userStore = useSelector((state) => state.userStore);
    const [assetSummaryGoalData, setAssetSummaryGoalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        async function fetchAndDigestData() {
            setIsLoading(true);
            const fetchedGoalAsset = await fetchGoalAsset(goalData, userStore);
            const allFundsMap = new Map();
            fetchedGoalAsset.forEach((asset) => {
                const { unit, fundName, spec_code, proj_id } = asset.Funds[0];
                if (allFundsMap.has(fundName)) {
                    allFundsMap.set(fundName, {
                        unit: allFundsMap.get(fundName).unit + unit,
                        fundName: fundName,
                        spec_code: spec_code,
                        proj_id: proj_id,
                    });
                } else {
                    allFundsMap.set(fundName, {
                        unit: unit,
                        fundName: fundName,
                        spec_code: spec_code,
                        proj_id: proj_id,
                    });
                }
            });
            const allFunds = [];
            allFundsMap.forEach((object, fundName) => {
                allFunds.push({
                    fundName: fundName,
                    unit: object.unit,
                    spec_code: object.spec_code,
                    proj_id: object.proj_id,
                });
            });
            const digestedFundsData = await fetchLastestPrice(allFunds, userStore);
            setAssetSummaryGoalData(digestedFundsData);
            setIsLoading(false);
        }
        if (goalData && userStore.userToken) {
            fetchAndDigestData();
        }
    }, [goalData, userStore]);

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
