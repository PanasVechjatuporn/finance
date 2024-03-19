import React from "react";
import { Link } from "react-router-dom";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, CardActionArea, CardActions } from '@mui/material';
import GoalCard from "components/GoalCard";
import mockGoal from "mockupData/mockGoal.json"
import axios from 'axios';
import { useSelector } from 'react-redux';

export const GoalBased = () => {

    const uid = useSelector(state => state.userStore.userId)
    const [data, setData] = React.useState([])
    React.useEffect(() => {
        async function fetchData() {
            await axios.get(`http://localhost:8000/db/userdata=${uid}`)
                .then(response => { setData(response.data); console.log(response, uid) });
        }
        fetchData();
    }, [uid])

    const [openCreate, setOpenCreate] = React.useState(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);
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
                        <Button sx={{ backgroundColor: 'black', marginRight: 2 }} size="small" >
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
            <Container style={{ display: 'flex', marginTop: 20, paddingTop: 10, paddingBottom: 10, width: "70%", maxHeight: 400, overflow: 'auto', backgroundColor: '#F0F0F0' }}>
                <GoalCard MockGoal={mockGoal} />
                <Card sx={{ minWidth: 300, paddingTop: 1, paddingBottom: 1, margin: 1 }}>
                    <CardMedia
                        component="img"
                        height="100"
                        image=""
                        alt="icon/image"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            ชื่อ :
                        </Typography>
                        <Typography component="div" variant="subtitile1" color="text.secondary">
                            ระยะเวลาการลงทุน :
                        </Typography>
                        <Typography component="div" variant="subtitile1" color="text.secondary">
                            เป้าหมาย :
                        </Typography>
                        <Typography component="div" variant="subtitile1" color="text.secondary">
                            วันที่สร้าง :
                        </Typography>
                    </CardContent>
                    <CardActions style={{ width: '100%', justifyContent: 'center', gap: '10%' }}>
                        <Button onClick={handleOpenCreate} sx={{ backgroundColor: 'black' }} size="medium" >
                            <Typography color='white' variant="subtitile1">
                                สร้างเป้าหมาย
                            </Typography>
                        </Button>
                        <ModalCreate openCreate={openCreate} handleCloseCreate={handleCloseCreate} />
                    </CardActions>
                </Card>
            </Container >
        </React.Fragment >
    );
};
