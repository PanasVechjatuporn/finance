import React, { useState } from "react";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, CardActions, TextField } from "@mui/material";
import GoalCard from "components/GoalCard";
//import mockGoal from "mockupData/mockGoal.json"
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { AssetSummary } from "components/AssetSummary_GoalBased";
import CircularProgress from '@mui/joy/CircularProgress';
import { RiskProfilePromptModal } from "components/RiskProfilePromptModal_GoalBased";
import { CurrentUserRiskProfile } from "components/CurrentUserRiskProfile";
import  { UserNetSummary }  from "components/UserNetSummary";
const baseURL = "http://localhost:8000";

export const GoalBased = () => {
    const navigate = useNavigate();

    const uid = useSelector((state) => state.userStore.userId);
    const token = useSelector((state) => state.userStore.userToken);
    const [data, setData] = React.useState([]);
    const [goal, setGoal] = React.useState([]);
    const [isloading, setIsloading] = React.useState(true);
    const [needAllocate, setNeedAllocate] = React.useState(false)

    const [isItNormal, setIsitNormal] = React.useState();
    const [riskProfile, setRiskProfile] = React.useState();

    const [isOpenRiskProfilePrompModal, setIsOpenRiskProfilePrompModal] = useState(false);
    React.useEffect(() => {
        async function fetchData() {
            if (uid != null) {
                let riskProfileTemp;
                await axios
                    .get(`http://localhost:8000/db/userdata=${uid}`)
                    .then((response) => {
                        setData(response.data);
                    });
                await axios
                    .get(`http://localhost:8000/db/usergoal=${uid}`)
                    .then((res) => {
                        setGoal(res.data);
                    });
                setIsloading(false);
            }
        }
        fetchData();
    }, [uid]);
    React.useEffect(() => {
        async function fetchData() {
            if (uid != null) {
                await axios
                    .get(`http://localhost:8000/db/userdata=${uid}`)
                    .then((response) => {
                        setData(response.data);
                    });
                await axios
                    .get(`http://localhost:8000/db/usergoal=${uid}`)
                    .then((res) => {
                        setGoal(res.data);
                        if (res.data.length > 0) {
                            const sumPercent =
                                res.data.reduce(
                                    (acc, current) => acc + Number(current.Percentage || 0),
                                    0
                                );
                            if (sumPercent !== 100) {
                                setNeedAllocate(true)
                            } else {
                                setNeedAllocate(false)
                            }
                        }
                    });
                setIsloading(false);
                // console.log(needAllocate)
                if (needAllocate === true) { handleOpenEditGoal() }
            }
        }
        fetchData();
    }, [uid, needAllocate]);



    function handleGoalTypeClick(type) {
        console.log('handleGoalTypeClick')
        if (type === "normal") {
            setIsitNormal(true);
        } else if (type === "tax") {
            setIsitNormal(false);
        }
        if (goal.length > 0) {
            if (type === "normal") {
                navigate("./normal-goal", { state: { Percentage: 100 } });
            }else{
                handleOpenNewGoal();
            }
        } else {
            if (type === "normal") {
                navigate("./normal-goal", { state: { Percentage: 100 } });
            } else if (type === "tax") {
                navigate("./reduce-tax-goal", {
                    state: { Percentage: 100, data: data },
                });
            }
        }
    }

    async function handleCreateGoal() {
        const getResult = await axios.get(`${baseURL}/db/get_user_risk_profile`, {
            headers: {
                Authorization: token,
                userId: uid,
            },
        });
        try{
            if(getResult.data.findResult !== null){
                if (goal.length > 0) {
                    const found = goal.some((obj) => obj.Name === "ลดหย่อนภาษี");
                    if (found) {
                        handleOpenNewGoal();
                        setIsitNormal(true);
                    } else {
                        handleOpenCreate();
                    }
                } else {
                    handleOpenCreate();
                }
            }else{
                setIsOpenRiskProfilePrompModal(true);
            }
        }catch(err){
            console.log('err :: ',err)
        }
    }

    const [openNewGoal, setOpenNewGoal] = React.useState(false);
    const handleOpenNewGoal = () => {
        setOpenNewGoal(true);
        handleCloseCreate();
    };
    const handleCloseNewGoal = () => setOpenNewGoal(false);
    const ModalNewGoal = ({ open, close }) => {
        const [goalPercent, setGoalPercent] = React.useState("");
        const [oldGoal, setOldGoal] = React.useState(
            JSON.parse(JSON.stringify(goal))
        );

        function handleSubmit(event) {
            if (isItNormal === true) {
                handleCloseNewGoal();
                navigate("./normal-goal", {
                    state: { Percentage: goalPercent, goal: oldGoal, riskProfile: riskProfile },
                });
                event.preventDefault();
            } else if (isItNormal === false) {
                handleCloseNewGoal();
                navigate("./reduce-tax-goal", {
                    state: { Percentage: goalPercent, data: data, goal: oldGoal },
                });
                event.preventDefault();
            }
        }

        let Exceed = false;
        const sumPercent =
            oldGoal.reduce(
                (acc, current) => acc + Number(current.Percentage || 0),
                0
            ) + goalPercent;
        if (sumPercent !== 100) {
            Exceed = true;
        } else {
            Exceed = false;
        }

        return (
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Tooltip
                    title="สัดส่วนการลงทุนต้องรวมกันได้ 100 %"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "white",
                                "& .MuiTooltip-arrow": {
                                    color: "white",
                                },
                                color: "red",
                                fontSize: 16,
                                padding: 1,
                            },
                        },
                    }}
                    placement="top"
                    arrow
                    open={Exceed}
                >
                    <form
                        onSubmit={(event) => {
                            handleSubmit(event);
                        }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            minWidth: 380,
                            backgroundColor: "white",
                            border: "0px solid #000",
                            borderRadius: 7,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: 30,
                            paddingBottom: 30,
                        }}
                    >
                        <Typography
                            gutterBottom
                            id="modal-modal-title"
                            variant="subtitile1"
                            fontWeight={"bold"}
                        >
                            เงินลงทุนของคุณในเป้าหมายใหม่ :
                        </Typography>
                        <div
                            style={{
                                marginTop: 15,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TextField
                                required
                                inputProps={{ style: { textAlign: "center", fontSize: 14 } }}
                                placeholder="สัดส่วนเงินที่จะลงทุน"
                                id="standard-basic"
                                label=""
                                value={goalPercent}
                                onChange={(e) => {
                                    if (e.target.value.match(/^[1-9][0-9]{0,1}$/)) {
                                        setGoalPercent(Math.min(100, e.target.value));
                                    } else if (!e.target.value) {
                                        setGoalPercent("");
                                    }
                                }}
                            />
                            {/* onChange={(e) => {
                            if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                const sanitizedValue = e.target.value.replace(/,/g, '');
                                setGoalValue(parseInt(sanitizedValue).toLocaleString());
                            }
                            else if (!e.target.value) {
                                setGoalValue('')
                            }
                        }} */}
                            <Typography
                                marginLeft={1}
                                id="modal-modal-title"
                                variant="subtitile1"
                            >
                                %
                            </Typography>
                        </div>

                        <Typography
                            marginTop={3}
                            gutterBottom
                            id="modal-modal-title"
                            variant="subtitile1"
                            fontWeight={"bold"}
                        >
                            เงินลงทุนในเป้าหมายทั้งหมด :
                        </Typography>
                        {oldGoal.length > 0
                            ? oldGoal.map((eachGoal, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginTop: 15,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        marginRight={1}
                                        id="modal-modal-title"
                                        variant="subtitile1"
                                    >
                                        {eachGoal.Name} :
                                    </Typography>
                                    <TextField
                                        required
                                        inputProps={{
                                            style: {
                                                textAlign: "center",
                                                fontSize: 14,
                                                height: 10,
                                                width: 70,
                                            },
                                        }}
                                        placeholder="สัดส่วน"
                                        id="standard-basic"
                                        label=""
                                        value={eachGoal.Percentage}
                                        onChange={(e) => {
                                            if (e.target.value.match(/^[1-9][0-9]{0,1}$/)) {
                                                let updatedGoal = [...oldGoal];
                                                updatedGoal[index].Percentage = e.target.value;
                                                setOldGoal(updatedGoal);
                                                // console.log(oldGoal);
                                            } else if (!e.target.value) {
                                                let updatedGoal = [...oldGoal];
                                                updatedGoal[index].Percentage = "";
                                                setOldGoal(updatedGoal);
                                                // console.log(oldGoal);
                                            }
                                        }}
                                    />
                                    <Typography
                                        marginLeft={1}
                                        id="modal-modal-title"
                                        variant="subtitile1"
                                    >
                                        %
                                    </Typography>
                                </div>
                            ))
                            : null}

                        <Container
                            style={{
                                marginTop: 30,
                                width: "65%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                onClick={handleCloseNewGoal}
                                sx={{
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                    backgroundColor: "black",
                                    marginRight: 2,
                                }}
                                size="medium"
                            >
                                <Typography color="white" variant="subtitile1">
                                    ยกเลิก
                                </Typography>
                            </Button>
                            <Button
                                disabled={Exceed}
                                type="submit"
                                sx={{
                                    backgroundColor: Exceed === true ? "gray" : "black",
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                }}
                                size="medium"
                            >
                                <Typography color="white" variant="subtitile1">
                                    ยืนยัน
                                </Typography>
                            </Button>
                        </Container>
                    </form>
                </Tooltip>
            </Modal>
        );
    };

    const [openCreate, setOpenCreate] = React.useState(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => {
        setOpenCreate(false);
    };
    const ModalCreate = ({ openCreate, handleCloseCreate }) => {
        return (
            <Modal
                open={openCreate}
                onClose={handleCloseCreate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        backgroundColor: "white",
                        border: "0px solid #000",
                        borderRadius: 7,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 12,
                        paddingBottom: 12,
                    }}
                >
                    <Typography gutterBottom id="modal-modal-title" variant="subtitile1">
                        สร้างเป้าหมาย
                    </Typography>
                    <Container
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={(e) => handleGoalTypeClick("normal")}
                            sx={{ backgroundColor: "black", marginRight: 2 }}
                            size="small"
                        >
                            <Typography color="white" variant="subtitile1">
                                เพื่อเก็บออมเงิน
                            </Typography>
                        </Button>
                        <Button
                            onClick={(e) => handleGoalTypeClick("tax")}
                            sx={{ backgroundColor: "black" }}
                            size="small"
                        >
                            <Typography color="white" variant="subtitile1">
                                เพื่อลดหย่อนภาษี
                            </Typography>
                        </Button>
                    </Container>
                </Container>
            </Modal>
        );
    };

    const [openEditGoal, setOpenEditGoal] = React.useState(false);
    const handleOpenEditGoal = () => {
        setOpenEditGoal(true);
    };
    const handleCloseEditGoal = () => setOpenEditGoal(false);
    const ModalEditGoal = ({ open, close }) => {
        const [editGoalPercent, setEditGoalPercent] = React.useState(
            JSON.parse(JSON.stringify(goal))
        );

        function handleSubmit(event) {
            axios.post(
                `http://localhost:8000/db/change_goal_percentage`,
                {
                    userId: uid,
                    goal: editGoalPercent,
                },
                {
                    headers: {
                        Authorization: token,
                        UserId: uid
                    },
                }
            )
            event.preventDefault();
            handleCloseEditGoal();
            window.location.reload(false);
        }

        let Exceed = false;
        const sumPercent =
            editGoalPercent.reduce(
                (acc, current) => acc + Number(current.Percentage || 0),
                0
            );
        if (sumPercent !== 100) {
            Exceed = true;
        } else {
            Exceed = false;
        }

        return (
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Tooltip
                    title="สัดส่วนการลงทุนต้องรวมกันได้ 100 %"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "white",
                                "& .MuiTooltip-arrow": {
                                    color: "white",
                                },
                                color: "red",
                                fontSize: 16,
                                padding: 1,
                            },
                        },
                    }}
                    placement="top"
                    arrow
                    open={Exceed}
                >
                    <form
                        onSubmit={(event) => {
                            handleSubmit(event);
                        }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            minWidth: 380,
                            backgroundColor: "white",
                            border: "0px solid #000",
                            borderRadius: 7,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: 30,
                            paddingBottom: 30,
                        }}
                    >
                        <Typography
                            gutterBottom
                            id="modal-modal-title"
                            variant="subtitile1"
                            fontWeight={"bold"}
                        >
                            {needAllocate === true ? "จัดสรรสัดส่วนการลงทุนใหม่ :" : "เงินลงทุนในเป้าหมายทั้งหมด :"}
                        </Typography>
                        {editGoalPercent.length > 0
                            ? editGoalPercent.map((eachGoal, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginTop: 15,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        marginRight={1}
                                        id="modal-modal-title"
                                        variant="subtitile1"
                                    >
                                        {eachGoal.Name} :
                                    </Typography>
                                    <TextField
                                        required
                                        inputProps={{
                                            style: {
                                                textAlign: "center",
                                                fontSize: 14,
                                                height: 10,
                                                width: 70,
                                            },
                                        }}
                                        placeholder="สัดส่วน"
                                        id="standard-basic"
                                        label=""
                                        value={eachGoal.Percentage}
                                        onChange={(e) => {
                                            if (e.target.value.match(/^[1-9][0-9]{0,2}$/)) {
                                                let updatedGoal = [...editGoalPercent];
                                                updatedGoal[index].Percentage = e.target.value;
                                                setEditGoalPercent(updatedGoal);
                                            } else if (!e.target.value) {
                                                let updatedGoal = [...editGoalPercent];
                                                updatedGoal[index].Percentage = "";
                                                setEditGoalPercent(updatedGoal);
                                            }
                                        }}
                                    />
                                    <Typography
                                        marginLeft={1}
                                        id="modal-modal-title"
                                        variant="subtitile1"
                                    >
                                        %
                                    </Typography>
                                </div>
                            ))
                            : null}

                        <Container
                            style={{
                                marginTop: 30,
                                width: "65%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                onClick={handleCloseEditGoal}
                                sx={{
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                    backgroundColor: needAllocate === true ? "gray" : "black",
                                    marginRight: 2,
                                }}
                                size="medium"
                                disabled={needAllocate}
                            >
                                <Typography color="white" variant="subtitile1">
                                    ยกเลิก
                                </Typography>
                            </Button>
                            {Exceed === true ? (
                                <Button
                                    disabled="true"
                                    type="submit"
                                    sx={{
                                        backgroundColor: "gray",
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }}
                                    size="medium"
                                >
                                    <Typography color="white" variant="subtitile1">
                                        ยืนยัน
                                    </Typography>
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    sx={{
                                        backgroundColor: "black",
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }}
                                    size="medium"
                                >
                                    <Typography color="white" variant="subtitile1">
                                        ยืนยัน
                                    </Typography>
                                </Button>
                            )}
                        </Container>
                    </form>
                </Tooltip>
            </Modal>
        );
    };

    return (
        <React.Fragment>
            <Navigate />
            <Typography marginBottom={5} marginTop={5} variant="h5" textAlign={"center"} fontWeight={'bold'}>Goal-Based Investment</Typography>
            <CurrentUserRiskProfile></CurrentUserRiskProfile>
            <UserNetSummary/>
            <Container
                style={{
                    display: "flex",
                    marginTop: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    width: "70%",
                    maxHeight: 400,
                    overflow: "auto",
                    backgroundColor: "#F0F0F0",
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: 'gray',
                }}
            >
                <GoalCard Goal={goal} />
                <Card
                    sx={{
                        minHeight: 300,
                        minWidth: 300,
                        paddingTop: 1,
                        paddingBottom: 1,
                        margin: 1,
                    }}
                >
                    <CardActions
                        sx={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {isloading === false ? <Button
                            onClick={handleCreateGoal}
                            sx={{ backgroundColor: "black" }}
                            size="large"
                        >
                            <Typography color="white" variant="subtitile1">
                                สร้างเป้าหมาย
                            </Typography>
                        </Button>
                            :
                            <CircularProgress
                                color="neutral"
                                value={35}
                                variant="plain"
                            />}
                        <ModalCreate
                            openCreate={openCreate}
                            handleCloseCreate={handleCloseCreate}
                        />
                        {/* <ModalNewGoal open={openNewGoal} close={handleCloseNewGoal} /> */}
                        <RiskProfilePromptModal isOpen={isOpenRiskProfilePrompModal} setIsOpen={setIsOpenRiskProfilePrompModal}></RiskProfilePromptModal>
                    </CardActions>
                </Card>
            </Container>
            {goal.length > 0 ?
                <Container style={{ display: 'flex', justifyContent: 'right', width: '70%', marginTop: 10 }}>
                    <Tooltip title='แก้ไสัดส่วนการลงทุน' arrow placement="right">
                        <Button onClick={handleOpenEditGoal} sx={{ backgroundColor: 'green', color: 'white', fontWeight: 'normal' }}>
                            แก้ไข
                        </Button>
                    </Tooltip>
                    {/* <ModalEditGoal open={openEditGoal} close={handleCloseEditGoal} /> */}
                </Container> : null}
            <AssetSummary></AssetSummary>
        </React.Fragment>
    );
};
