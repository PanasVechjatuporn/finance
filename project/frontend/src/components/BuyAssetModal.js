import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import axios from "axios";
import { ComponentLoading } from "./OverlayLoading";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { LineChart } from "@mui/x-charts/LineChart";

const baseURL = "http://localhost:8000";

async function getFundsLastestNav(proj_id, userStore) {
    try {
        const res = await axios.get(`${baseURL}/secapiutils/get_lastest_nav`, {
            headers: {
                proj_id: proj_id,
                userId: userStore.userId,
                userToken: userStore.userToken,
            },
        });
        return res.data[0];
    } catch (err) {
        console.log("err :: ", err);
    }
}

async function getNavYearToDate(proj_id, userStore) {
    try {
        const res = await axios.get(`${baseURL}/db/get_nav`, {
            headers: {
                ProjectId: proj_id,
                Authorization: userStore.userToken,
                UserId: userStore.userId,
                GetYearToDate: true,
            },
        });
        return res.data.navYearToDate;
    } catch (err) {
        console.log("err :: ", err);
    }
}

function digestYearToDateData(data) {
    let graphWholeData = [];
    let graphDayData = [];
    let graphData = [];
    data.forEach((entry) => {
        graphData.push(entry.lastVal);
        graphDayData.push(entry.navDate);
    });
    graphWholeData.push(graphData);
    graphWholeData.push(graphDayData);
    return graphWholeData;
}

function digestDataWithPrediction(data, fundData) {
    //digestDataWithPrediction fundData will gives us growth rate that model predict
    let tmpNav = [];
    let tmpDate = [];
    let tmpPredNav = [];
    let tmpPredDate = [];
    let tmpWholeData = [];
    let lastPushedMonth;
    //create real data from data year to that params of this function
    for (let i = data.length - 1; i > 0; i--) {
        if (tmpNav.length === 12) {
            break;
        }
        if (new Date(data[i].navDate).getMonth() !== lastPushedMonth) {
            tmpNav.unshift(data[i].lastVal);
            tmpDate.unshift(data[i].navDate);
            lastPushedMonth = new Date(data[i].navDate).getMonth();
        }
    }
    for (let i = 0; i < tmpNav.length; i++) {
        tmpPredNav.push(null);
    }
    tmpPredNav.push(tmpNav[tmpNav.length - 1]);
    tmpPredDate.push(tmpDate[tmpDate.length - 1]);
    console.log(fundData.growth_rate_predict)
    for (let i = tmpNav.length; i < tmpNav.length * 2; i++) {
        if (tmpPredNav[i] + tmpPredNav[i] * fundData.growth_rate_predict + Number.EPSILON > 0) {
            tmpPredNav.push(
                tmpPredNav[i] + tmpPredNav[i] * fundData.growth_rate_predict + Number.EPSILON
            );
            tmpPredDate.push(
                formatDate(
                    new Date(
                        new Date(tmpPredDate[i - tmpNav.length]).getFullYear(),
                        new Date(tmpPredDate[i - tmpNav.length]).getMonth() + 1,
                        new Date(tmpPredDate[i - tmpNav.length]).getDate()
                    )
                )
            );
        } else {
            tmpPredNav.push(0);
            tmpPredDate.push(
                formatDate(
                    new Date(
                        new Date(tmpPredDate[i - tmpNav.length]).getFullYear(),
                        new Date(tmpPredDate[i - tmpNav.length]).getMonth() + 1,
                        new Date(tmpPredDate[i - tmpNav.length]).getDate()
                    )
                )
            );
        }
    }
    tmpWholeData.push(tmpNav);
    tmpWholeData.push(tmpDate);
    tmpWholeData.push(tmpPredNav);
    tmpWholeData.push(tmpPredDate);
    return tmpWholeData;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const BuyAssetModal = ({ fundData, open, setOpen, goalData }) => {
    const userStore = useSelector((state) => state.userStore);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedNav, setFetchedNav] = useState(null);
    const [yearToDateGraphData, setYearToDateGraphData] = useState(null);
    const [graphWithPredictionData, setGraphWithPredictionData] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (fundData && goalData && userStore) {
            setFetchedNav(null);
            setYearToDateGraphData(null);
            setIsLoading(true);
            Promise.all([
                getFundsLastestNav(fundData.proj_id, userStore),
                getNavYearToDate(fundData.proj_id, userStore),
            ])
                .then((res) => {
                    setFetchedNav(res[0]);
                    setYearToDateGraphData(digestYearToDateData(res[1]));
                    setGraphWithPredictionData(
                        digestDataWithPrediction(res[1], fundData)
                    );
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log("err :: ", err);
                });
        }
    }, [fundData, goalData, userStore]);

    return (
        <>
            <Modal
                show={open}
                onHide={() => {
                    handleClose();
                }}
                backdrop="static"
                className="edit-modal"
                style={{
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Modal.Header closeButton>
                    <div>
                        <Typography
                            variant="h5"
                            style={{
                                color: "#757575",
                                textDecoration: "underline",
                                textDecorationColor: "transparent",
                                display: "inline-block",
                                width: "100%",
                                userSelect: "none",
                                fontWeight: "bold",
                            }}
                        >
                            {fundData && fundData.proj_name_th}
                        </Typography>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {!isLoading && (
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={6} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        {yearToDateGraphData && (
                                            <LineChart
                                                sx={{
                                                    '& .MuiChartsAxis-tickContainer': {
                                                        '&:not(:has(>.MuiChartsAxis-tickLabel))': {
                                                            '& .MuiChartsAxis-tick': {
                                                                strokeWidth: 0,
                                                              },
                                                        },
                                                      }
                                                }}
                                                width={600}
                                                height={400}
                                                series={[
                                                    {
                                                        data: yearToDateGraphData[0],
                                                        label: "ราคาต่อหน่วย",
                                                        showMark: false,
                                                    },
                                                ]}
                                                xAxis={[
                                                    {
                                                        scaleType: "point",
                                                        data: yearToDateGraphData[1],
                                                    },
                                                ]}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        {graphWithPredictionData && (
                                            <LineChart
                                                sx={{
                                                    "& .MuiLineElement-series-Predict": {
                                                        strokeDasharray: "5 2",
                                                        strokeWidth: 2,
                                                        color: "red",
                                                    }
                                                }}
                                                width={600}
                                                height={400}
                                                series={[
                                                    {
                                                        data: graphWithPredictionData[0],
                                                        label: "ราคาต่อหน่วย (จริง)",
                                                        showMark: false,
                                                    },
                                                    {
                                                        id: "Predict",
                                                        data: graphWithPredictionData[2],
                                                        label: "ราคาต่อหน่วย (ทำนาย)",
                                                        showMark: false,
                                                        color: "orange"
                                                    },
                                                ]}
                                                xAxis={[
                                                    {
                                                        scaleType: "point",
                                                        data: graphWithPredictionData[1].concat(
                                                            graphWithPredictionData[3]
                                                        ),
                                                    },
                                                ]}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={6} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            required
                                            id={"goal-name"}
                                            label="เงินลงทุน"
                                            size="small"
                                            margin="normal"
                                            // error={nameError}
                                            helperText={"เงินที่ต้องการลงทุนในกองทุนนี้"}
                                            onChange={(e) => {
                                                let tmp = JSON.parse(JSON.stringify(goalData))
                                                tmp.Name = e.target.value
                                            }}
                                        // value={
                                        //     goalData.Name
                                        // }
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            required
                                            id={"goal-name"}
                                            label="เงินลงทุน"
                                            size="small"
                                            margin="normal"
                                            // error={nameError}
                                            helperText={"เงินที่ต้องการลงทุนในกองทุนนี้"}
                                            onChange={(e) => {
                                                let tmp = JSON.parse(JSON.stringify(goalData))
                                                tmp.Name = e.target.value
                                            }}
                                        // value={
                                        //     goalData.Name
                                        // }
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <Container>
                        <ComponentLoading isLoading={isLoading} />
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        ปิด
                    </Button>
                    <Button
                        variant="primary"
                        onClick={async () => {
                            try {
                                handleClose();
                            } catch (err) {
                                alert(err);
                            }
                        }}
                    >
                        <div>
                            <AddShoppingCartIcon /> ซื้อ
                        </div>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
