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
                    <>{!isLoading && fetchedNav && JSON.stringify(fetchedNav)}</>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid
                            container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Grid item xs={6} md={6}>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    {yearToDateGraphData && (
                                        <LineChart
                                            width={500}
                                            height={300}
                                            series={[
                                                {
                                                    data: yearToDateGraphData[0],
                                                    label: "ราคาต่อหน่วย",
                                                    showMark: false,
                                                    area: true,
                                                },
                                            ]}
                                            yAxis={[
                                                {
                                                    tickNumber: 5,
                                                    valueFormatter: (element) => `${element} บาท`,
                                                },
                                            ]}
                                            xAxis={[
                                                {
                                                    scaleType: "point",
                                                    data: yearToDateGraphData[1],
                                                    tickMinStep : 2,
                                                    min : new Date(new Date(yearToDateGraphData[1][0]).getFullYear() ,new Date(yearToDateGraphData[1][0]).getMonth() ,new Date(yearToDateGraphData[1][0]).getDay()),
                                                    max : new Date(new Date(yearToDateGraphData[1][yearToDateGraphData.length - 1]).getFullYear() ,new Date(yearToDateGraphData[1][yearToDateGraphData.length - 1]).getMonth() ,new Date(yearToDateGraphData[1][yearToDateGraphData.length - 1]).getDay())
                                                },
                                            ]}
                                        />         
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    {/* <LineChart
                                        width={500}
                                        height={300}
                                        series={[
                                            { data: pData, label: "pv" },
                                            { data: uData, label: "uv" },
                                        ]}
                                        xAxis={[
                                            { scaleType: "point", data: xLabels, disableTicks: true },
                                        ]}
                                    /> */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

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
