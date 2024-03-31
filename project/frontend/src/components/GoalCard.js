import React from "react";
import { Container } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, CardActions } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function EachCard({ data }) {
    const token = useSelector((state) => state.userStore.userToken);
    const [openStop, setOpenStop] = React.useState(false);
    const handleOpenStop = () => setOpenStop(true);
    const handleCloseStop = () => setOpenStop(false);
    const ModalStop = ({ openStop, handleCloseStop }) => {
        function handleStopGoal() {
            axios.post(
                `http://localhost:8000/db/stop_goal`,
                {
                    Name: data.Name,
                    userId: data.userId,
                },
                {
                    headers: {
                        Authorization: token,
                        UserId: data.userId,
                    },
                }
            );
            handleCloseStop();
            window.location.reload(false);
        }
        if (data.isActive === true || data.isActive === undefined)
            return (
                <Modal
                    open={openStop}
                    onClose={handleCloseStop}
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
                        <Typography id="modal-modal-title" variant="subtitile1">
                            ยืนยันการหยุดเป้าหมาย
                        </Typography>
                        <Typography gutterBottom id="modal-modal-description" variant="h6">
                            {data.Name || ""}
                        </Typography>
                        <Container
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "50%",
                            }}
                        >
                            <Button
                                onClick={handleStopGoal}
                                sx={{ backgroundColor: "green" }}
                                size="small"
                            >
                                <Typography color="white" variant="subtitile1">
                                    ตกลง
                                </Typography>
                            </Button>
                            <Button
                                onClick={handleCloseStop}
                                sx={{ backgroundColor: "brown" }}
                                size="small"
                            >
                                <Typography color="white" variant="subtitile1">
                                    ยกเลิก
                                </Typography>
                            </Button>
                        </Container>
                    </Container>
                </Modal>
            );
        else if (data.isActive === false)
            return (
                <Modal
                    open={openStop}
                    onClose={handleCloseStop}
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
                        <Typography id="modal-modal-title" variant="subtitile1">
                            ดำเนินการลงทุนในเป้าหมายนี้ต่อ
                        </Typography>
                        <Typography gutterBottom id="modal-modal-description" variant="h6">
                            {data.Name || ""}
                        </Typography>
                        <Container
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "50%",
                            }}
                        >
                            <Button
                                onClick={handleStopGoal}
                                sx={{ backgroundColor: "green" }}
                                size="small"
                            >
                                <Typography color="white" variant="subtitile1">
                                    ตกลง
                                </Typography>
                            </Button>
                            <Button
                                onClick={handleCloseStop}
                                sx={{ backgroundColor: "brown" }}
                                size="small"
                            >
                                <Typography color="white" variant="subtitile1">
                                    ยกเลิก
                                </Typography>
                            </Button>
                        </Container>
                    </Container>
                </Modal>
            );
    };
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = React.useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleClickEdit = (data) => {
        navigate("/Goal-Based/edit-normal-goal/"+data._id)
    }

    const ModalDelete = ({ openDelete, handleCloseDelete }) => {
        function handleDeleteGoal() {
            axios.post(
                `http://localhost:8000/db/delete_goal`,
                {
                    Name: data.Name,
                    goalId: data._id,
                },
                {
                    headers: {
                        Authorization: token,
                        UserId: data.userId,
                    },
                }
            );
            handleCloseDelete();
            window.location.reload(false);
        }
        return (
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
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
                    <Typography id="modal-modal-title" variant="subtitile1">
                        ยืนยันการลบเป้าหมาย
                    </Typography>
                    <Typography gutterBottom id="modal-modal-description" variant="h6">
                        {data.Name || ""}
                    </Typography>
                    <Container
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "50%",
                        }}
                    >
                        <Button sx={{ backgroundColor: "green" }} size="small">
                            <Typography
                                onClick={handleDeleteGoal}
                                color="white"
                                variant="subtitile1"
                            >
                                ตกลง
                            </Typography>
                        </Button>
                        <Button
                            onClick={handleCloseDelete}
                            sx={{ backgroundColor: "brown" }}
                            size="small"
                        >
                            <Typography color="white" variant="subtitile1">
                                ยกเลิก
                            </Typography>
                        </Button>
                    </Container>
                </Container>
            </Modal>
        );
    };

    if (data.Name !== "ลดหย่อนภาษี") {
        return (
            <Card
                sx={{
                    minHeight: 300,
                    minWidth: 300,
                    paddingTop: 1,
                    paddingBottom: 1,
                    margin: 1,
                }}
            >
                <CardMedia
                    component="img"
                    sx={{ height: 140 }}
                    image="./goalPlaceholder.jpg"
                    alt="icon/image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        ชื่อ : {data.Name || ""}
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitile1"
                        color="text.secondary"
                    >
                        ระยะเวลาการลงทุน : {parseInt(new Date(data.GoalTime).getFullYear()) - parseInt(new Date(data.CreatedDate).getFullYear()) + " ปี" || ""}
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitile1"
                        color="text.secondary"
                    >
                        เป้าหมาย : {data.Goal || ""}
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitile1"
                        color="text.secondary"
                    >
                        วันที่สร้าง :{" "}
                        {new Date(data.CreatedDate).toLocaleDateString("th-TH", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) || ""}
                    </Typography>
                </CardContent>
                <CardActions
                    style={{ width: "100%", justifyContent: "center", gap: "10%" }}
                >
                    <ModalStop openStop={openStop} handleCloseStop={handleCloseStop} />
                    <Button
                        onClick={() => {
                            handleClickEdit(data)
                        }}
                        sx={{ backgroundColor: "#3f28a8" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            แก้ไข
                        </Typography>
                    </Button>
                    <Button
                        onClick={handleOpenDelete}
                        sx={{ backgroundColor: "brown" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ลบ
                        </Typography>
                    </Button>
                    <ModalDelete
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                    />
                </CardActions>
            </Card>
        );
    } else {
        return (
            <Card
                sx={{
                    minHeight: 300,
                    minWidth: 300,
                    paddingTop: 1,
                    paddingBottom: 1,
                    margin: 1,
                }}
            >
                <CardMedia
                    component="img"
                    sx={{ height: 140 }}
                    image="./goalPlaceholder.jpg"
                    alt="icon/image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        ชื่อ : {data.Name || ""}
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitile1"
                        color="text.secondary"
                    >
                        ระยะเวลาการลงทุน : -
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitile1"
                        color="text.secondary"
                    >
                        เป้าหมาย : ลดหย่อนภาษีให้ได้มากที่สุด
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitile1"
                        color="text.secondary"
                    >
                        วันที่สร้าง :{" "}
                        {new Date(data.CreatedDate).toLocaleDateString("th-TH", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) || ""}
                    </Typography>
                </CardContent>
                <CardActions
                    style={{ width: "100%", justifyContent: "center", gap: "10%" }}
                >
                    {data.isActive === false ? (
                        <Button
                            onClick={handleOpenStop}
                            sx={{ backgroundColor: "#4042cf" }}
                            size="small"
                        >
                            <Typography color="white" variant="subtitile1">
                                ลงทุนต่อ
                            </Typography>
                        </Button>
                    ) : (
                        <Button
                            onClick={handleOpenStop}
                            sx={{ backgroundColor: "#c1c702" }}
                            size="small"
                        >
                            <Typography color="white" variant="subtitile1">
                                หยุด
                            </Typography>
                        </Button>
                    )}
                    <ModalStop openStop={openStop} handleCloseStop={handleCloseStop} />
                    <Button
                        onClick={handleOpenDelete}
                        sx={{ backgroundColor: "brown" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ลบ
                        </Typography>
                    </Button>
                    <ModalDelete
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                    />
                </CardActions>
            </Card>
        );
    }
}

export default function GoalCard({ Goal }) {
    if (Object.keys(Goal).length > 0) {
        return Goal.map((card) => <EachCard key={card.Name} data={card} />);
    }
}
