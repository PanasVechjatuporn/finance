import React from "react";
import { Link } from "react-router-dom";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, CardActionArea, CardActions, TextField } from '@mui/material';
import GoalCard from "components/GoalCard";
//import mockGoal from "mockupData/mockGoal.json"
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

export const GoalBased = () => {

    const navigate = useNavigate();

    const uid = useSelector(state => state.userStore.userId)
    const [data, setData] = React.useState([]);
    const [goal, setGoal] = React.useState([]);
    const [isloading, setIsloading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            if (uid != null) {
                await axios.get(`http://localhost:8000/db/userdata=${uid}`)
                    .then(response => { setData(response.data); });
                await axios.get(`http://localhost:8000/db/usergoal=${uid}`)
                    .then(res => { setGoal(res.data); console.log(res) });
                setIsloading(false);
            }
        }
        fetchData();
    }, [uid])

    const [openNewGoal, setOpenNewGoal] = React.useState(false);
    const handleOpenNewGoal = () => { setOpenNewGoal(true); handleCloseCreate() };
    const handleCloseNewGoal = () => setOpenNewGoal(false);
    const ModalNewGoal = ({ open, close }) => {
        const [goalName, setGoalName] = React.useState('');
        const [goalPeriod, setGoalPeriod] = React.useState('')
        const [goalValue, setGoalValue] = React.useState('')

        function handleSubmit(event) {
            handleCloseNewGoal();
            navigate("./", { state: { data: data } });
            event.preventDefault();
        }

        return (
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form onSubmit={event => { handleSubmit(event) }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 380,
                        backgroundColor: 'white',
                        border: '0px solid #000',
                        borderRadius: 7,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 30,
                        paddingBottom: 30
                    }}>
                    <Typography gutterBottom id="modal-modal-title" variant="subtitile1">
                        ชื่อเป้าหมาย :
                    </Typography>
                    <TextField required inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ชื่อเป้าหมาย' id="standard-basic" label="" value={goalName}
                        onChange={(e) => {
                            setGoalName(e.target.value)
                        }} />
                    <Typography gutterBottom marginTop={2} id="modal-modal-title" variant="subtitile1">
                        ระยะเวลาการลงทุน (ปี) :
                    </Typography>
                    <TextField required inputProps={{ style: { textAlign: 'center', fontSize: 14, } }} placeholder='ระยะเวลา' id="standard-basic" label="" value={goalPeriod}
                        onChange={(e) => {
                            if (e.target.value.match(/^[1-9][0-9]{0,1}$/)) {
                                setGoalPeriod(e.target.value)
                            }
                            else if (!e.target.value) {
                                setGoalPeriod('')
                            }
                        }} />

                    <Typography gutterBottom marginTop={2} id="modal-modal-title" variant="subtitile1">
                        เป้าหมาย (บาท) :
                    </Typography>
                    <TextField required inputProps={{ style: { textAlign: 'center', fontSize: 14, } }} placeholder='เงินเป้าหมาย' id="standard-basic" label="" value={goalValue}
                        onChange={(e) => {
                            if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                const sanitizedValue = e.target.value.replace(/,/g, '');
                                setGoalValue(parseInt(sanitizedValue).toLocaleString());
                            }
                            else if (!e.target.value) {
                                setGoalValue('')
                            }
                        }} />

                    <Container style={{
                        marginTop: 30, width: '65%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <Button onClick={handleCloseNewGoal} sx={{ paddingLeft: 2, paddingRight: 2, backgroundColor: 'black', marginRight: 2 }} size="medium" >
                            <Typography color='white' variant="subtitile1">
                                ยกเลิก
                            </Typography>
                        </Button>
                        <Button type="submit" sx={{ backgroundColor: 'black', paddingLeft: 2, paddingRight: 2 }} size="medium" >
                            <Typography color='white' variant="subtitile1">
                                ยืนยัน
                            </Typography>
                        </Button>
                    </Container>
                </form>
            </Modal>)
    }

    const [openCreate, setOpenCreate] = React.useState(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => { setOpenCreate(false) };
    const ModalCreate = ({ openCreate, handleCloseCreate }) => {
        return (
            <Modal
                open={openCreate}
                onClose={handleCloseCreate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: 'white',
                    border: '0px solid #000',
                    borderRadius: 7,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 12,
                    paddingBottom: 12
                }}>
                    <Typography gutterBottom id="modal-modal-title" variant="subtitile1">
                        สร้างเป้าหมายเพื่อลดภาษี
                    </Typography>
                    <Container style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Button onClick={handleOpenNewGoal} sx={{ backgroundColor: 'black', marginRight: 2 }} size="small" >
                            <Typography color='white' variant="subtitile1">
                                ไม่
                            </Typography>
                        </Button>
                        <Link
                            to={"./reduce-tax-goal"}
                            state={{ data: data }}
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            <Button sx={{ backgroundColor: 'black' }} size="small" >
                                <Typography color='white' variant="subtitile1">
                                    ใช่
                                </Typography>
                            </Button>
                        </Link>
                    </Container>
                </Container>
            </Modal>)
    }

    return (
        <React.Fragment>
            <Navigate />
            {isloading == false &&
                <Container style={{ display: 'flex', marginTop: 20, paddingTop: 10, paddingBottom: 10, width: "70%", maxHeight: 400, overflow: 'auto', backgroundColor: '#F0F0F0' }}>
                    <GoalCard Goal={goal} />
                    <Card sx={{ minHeight: 300, minWidth: 300, paddingTop: 1, paddingBottom: 1, margin: 1 }}>
                        <CardActions sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Button onClick={handleOpenCreate} sx={{ backgroundColor: 'black' }} size="large" >
                                <Typography color='white' variant="subtitile1">
                                    สร้างเป้าหมาย
                                </Typography>
                            </Button>
                            <ModalCreate openCreate={openCreate} handleCloseCreate={handleCloseCreate} />
                            <ModalNewGoal open={openNewGoal} close={handleCloseNewGoal} />
                        </CardActions>
                    </Card>
                </Container >}
        </React.Fragment >
    );
};
