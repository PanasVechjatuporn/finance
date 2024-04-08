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
import { formatNumberWithCommas, roundNumber } from "utils/numberUtil";
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

async function fetchGoalAsset(userStore, goalData) {
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

export const AssetSummaryGoalTable = ({ selectedData, goalData, mode }) => {
    const userStore = useSelector((state) => state.userStore);
    const [isLoading, setIsLoading] = useState(false);
    const [modeSpecificData, setModeSpecificData] = useState(null);

    useEffect(() => {
        if (mode === "specific" && goalData && userStore.userToken) {
            setIsLoading(true);
            const fetchData = async () => {
                const fetchedData = await fetchGoalAsset(userStore, goalData);
                setModeSpecificData(fetchedData);
            };
            fetchData();
        }
        setIsLoading(false);
    }, [goalData, mode, userStore]);

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
                ตารางแสดงการลงทุนภายในเป้าหมาย {selectedData && selectedData.Name}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell rowSpan={2}>
                                วันที่ซื้อ&nbsp;(วว/ดด/ปป)
                            </StyledTableCell>
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
                                ประเภทของกองทุน
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
                            
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {selectedData && mode !== "specific" ? (
                            selectedData.assets.length > 0 ? (
                                <>
                                    {selectedData.assets.map((asset, index) => (
                                        <React.Fragment
                                            key={asset.CreatedDate + "-" + index + "-fragment"}
                                        >
                                            <StyledTableRow
                                                key={asset.CreatedDate + "-" + index + "-header"}
                                            >
                                                <StyledTableCell rowSpan={asset.Funds.length + 1}>
                                                    {new Date(asset.timeStamp).toLocaleDateString(
                                                        "en-GB"
                                                    )}
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
                                                            subAsset.assetType === "deposit"
                                                                ? "center"
                                                                : "left"
                                                        }
                                                    >
                                                        {subAsset.fundName &&
                                                            subAsset.assetType !== "deposit"
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
                            ) : (
                                <TableCell colSpan={7} align="center">
                                    ไม่พบข้อมูล
                                </TableCell>
                            )
                        ) : modeSpecificData ? (
                            <>
                                {modeSpecificData.length > 0 ? (
                                    <>
                                        {modeSpecificData.map((asset, index) => (
                                            <React.Fragment
                                                key={asset.CreatedDate + "-" + index + "-fragment"}
                                            >
                                                <StyledTableRow
                                                    key={asset.CreatedDate + "-" + index + "-header"}
                                                >
                                                    <StyledTableCell rowSpan={asset.Funds.length + 1}>
                                                        {new Date(asset.timeStamp).toLocaleDateString(
                                                            "en-GB"
                                                        )}
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
                                                                subAsset.assetType === "deposit"
                                                                    ? "center"
                                                                    : "left"
                                                            }
                                                        >
                                                            {subAsset.fundName &&
                                                                subAsset.assetType !== "deposit"
                                                                ? subAsset.fundName
                                                                : "-"}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {subAsset.spec_code ? subAsset.spec_code : "-"}
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
                                                    </StyledTableRow>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </>
                                ) : (
                                    <TableRow>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    <ComponentLoading
                                                        isLoading={isLoading}
                                                        size={"300px"}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableCell colSpan={7} align="center">
                                                ไม่พบข้อมูล
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </>
                        ) : (
                            <TableRow>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <ComponentLoading isLoading={isLoading} size={"300px"} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableCell colSpan={7} align="center">
                                        ไม่พบข้อมูล
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
