import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const baseURL = "http://localhost:8000";

export const CurrentUserRiskProfile = () => {
    const userStore = useSelector((state) => state.userStore);
    const [userRiskProfile, setUserRiskProfile] = useState(null);
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
                {userRiskProfile === null ? (
                    <Typography>คุณยังไม่ได้ทำแบบประเมินความเสี่ยง</Typography>
                ) : (
                    <>
                        <Typography>
                            ความเสี่ยงปัจจุบันของคุณคือ : {userRiskProfile}
                        </Typography>
                        <Typography>เราแนะนำให้ซื้อกองทุนภายในระดับความเสี่ยง :</Typography>
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
                            <>เริ่มทำแบบประเมินความเสี่ยง</>
                        ) : (
                            <>ประเมินความเสี่ยงใหม่</>
                        )}
                    </Typography>
                </Button>
            </Box>
        </Container>
    );
};
