import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";
import axios from "axios";
import { ComponentLoading } from "./OverlayLoading";
const baseURL = "http://localhost:8000";

async function getFundsLastestNav(proj_id) {
    try {
        const res = await axios.get(`${baseURL}/secapiutils/get_lastest_nav`, {
            headers: {
                proj_id: proj_id
            },
        });
        console.log("res :: ", res.data[0]);
        return res.data[0];
    } catch (err) {
        console.log("err :: ", err);
    }
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
};

export const BuyAssetModal = ({fundData, open, setOpen, goalData}) => {
    const [isLoading,setIsLoading] = useState(false)
    const handleClose = () => setOpen(false);
    const userStore = useSelector((state) => state.userStore);
    const [fetchedNav, setFetchedNav] = useState(null);
    useEffect(() => {
        if(fundData && goalData && userStore){
            console.log('fetching Data')
            setIsLoading(true)
            getFundsLastestNav(fundData.proj_id).then(res => {
                setFetchedNav(res)
                setIsLoading(false)
            });
        }
        
    }, [fundData, goalData, userStore])

    return (
        <>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition={true}
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
            disableAutoFocus
        >
            <Fade in={open}>
                <Box sx={style}>
                    <div>
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
                                marginBottom: "12px",
                                fontWeight: "bold"
                            }}
                        >
                            {fundData && fundData.proj_name_th}
                        </Typography>
                    </div>
                    <>
                    {fetchedNav && JSON.stringify(fetchedNav)}
                    </>
                    <div>
                        <ComponentLoading isLoading={isLoading}/>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </>
    )
}