import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMasterDataByName } from "utils/masterDataUtil";
const baseURL = "http://localhost:8000";

export const CurrentUserRiskProfile = () => {
    const userStore = useSelector((state) => state.userStore);
    const [userRiskProfile, setUserRiskProfile] = useState(null);
    const [riskProfileMasterData, setRiskProfileMasterData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchRiskProfile() {
            if (userStore.userId !== null) {
                try {
                    const riskProfile = await axios.get(
                        `${baseURL}/db/get_user_risk_profile`,
                        {
                            headers: {
                                Authorization: userStore.userToken,
                                userId: userStore.userId,
                            },
                        }
                    );
                    if (riskProfile.data.findResult) {
                        const masterData = await getMasterDataByName('riskProfileMasterData');
                        const riskMasterData = masterData.risk.filter(data => (data.level === riskProfile.data.findResult.riskProfile))
                        setRiskProfileMasterData(riskMasterData)
                        setUserRiskProfile(riskProfile.data.findResult.riskProfile);
                    }
                } catch (err) {
                    console.log("err :: ", err);
                    setUserRiskProfile(null);
                }
            }
        }
        fetchRiskProfile();
    }, [userStore]);
    const handleClickEvalRiskProfile = () => {
        navigate("/Goal-Based/risk-evaluation-normal");
    };
    return (
        <Container
            sx={{
                marginTop: 5,
                display: "ruby-text",
            }}
        >
            <Box
                sx={{
                    minWidth: "90%",
                    minHeight: "90%",
                    maxWidth: "90%",
                    maxHeight: "90%",
                    borderRadius: 6,
                    boxShadow: 6,
                    padding: 4,
                    position: "relative",
                    overflow: "auto",
                    justifyContent: "center",
                }}
            >
                {(userRiskProfile === null ) ? (
                    <Typography>You haven't done the risk assessment yet.</Typography>
                ) : (
                    <>
                        <Typography>
                            ความเสี่ยงปัจจุบันของคุณคือ : {riskProfileMasterData[0].labelTH}
                        </Typography>
                        <Typography>แนะนำให้ซื้อกองทุนภายในระดับความเสี่ยง : {riskProfileMasterData[0].recommendBuy.map((data,index) => (
                       <React.Fragment key={index}>
                       {(data).toLocaleString()}
                       {index !== riskProfileMasterData[0].recommendBuy.length - 1 && ", "}
                   </React.Fragment>))}</Typography>
                    </>
                )}
                <Button
                    onClick={handleClickEvalRiskProfile}
                    sx={{
                        backgroundColor: "black",
                    }}
                    size="medium"
                >
                    <Typography color="white" variant="subtitile1">
                        {userRiskProfile === null ? (
                            <>Start doing the risk assessment.</>
                        ) : (
                            <>ประเมินความเสี่ยงใหม่</>
                        )}
                    </Typography>
                </Button>
            </Box>
        </Container>
    );
};
