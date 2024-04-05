import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import axios from "axios";
import { ComponentLoading } from "./OverlayLoading";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Button from "react-bootstrap/Button";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { LineChart } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

const baseURL = "http://localhost:8000";

async function getFundsLastestNav(proj_id, userStore) {
    try {
        console.log(userStore)
        const res = await axios.get(`${baseURL}/secapiutils/get_lastest_nav`, {
            headers: {
                proj_id: proj_id,
                userId : userStore.userId,
                userToken : userStore.userToken 
            },
        });
        return res.data[0];
    } catch (err) {
        console.log("err :: ", err);
    }
}

async function getNavYearToDate(proj_id,userStore) {
    try {
        const res = await axios.get(`${baseURL}/db/get_nav`, {
            headers: {
                ProjectId: proj_id,
                Authorization : userStore.userToken,
                UserId : userStore.userId,
                GetYearToDate : true
            },
        });
        return res.data.navYearToDate;
    } catch (err) {
        console.log("err :: ", err);
    }
}

export const BuyAssetModal = ({ fundData, open, setOpen, goalData }) => {
    const userStore = useSelector((state) => state.userStore);
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => {
        setOpen(false)
    };
    const [fetchedNav, setFetchedNav] = useState(null);
    useEffect(() => {
        if (fundData && goalData && userStore) {
            setIsLoading(true)
            Promise.all([getFundsLastestNav(fundData.proj_id, userStore), getNavYearToDate(fundData.proj_id, userStore)]).then(res => {
                console.log('res[1] :: ',res[1])
                setFetchedNav(res[0])
                setIsLoading(false)
            }).catch(err => {
                console.log('err :: ', err)
            })

        }
    }, [fundData, goalData, userStore])

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
                    top: '60%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
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
                                fontWeight: "bold"
                            }}
                        >
                            {fundData && fundData.proj_name_th}
                        </Typography>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <>
                        {!isLoading && fetchedNav && JSON.stringify(fetchedNav)}
                    </>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container
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
                                    <LineChart
                                        width={500}
                                        height={300}
                                        series={[
                                            { data: pData, label: 'pv' },
                                            { data: uData, label: 'uv' },
                                        ]}
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <LineChart
                                        width={500}
                                        height={300}
                                        series={[
                                            { data: pData, label: 'pv' },
                                            { data: uData, label: 'uv' },
                                        ]}
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                    />
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
                            <AddShoppingCartIcon />{" "}ซื้อ
                        </div>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}