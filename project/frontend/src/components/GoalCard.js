import React from "react";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, CardActionArea, CardActions } from '@mui/material';

function EachCard({ data }) {
    const [openStop, setOpenStop] = React.useState(false);
    const handleOpenStop = () => setOpenStop(true);
    const handleCloseStop = () => setOpenStop(false);
    const ModalStop = ({ openStop, handleCloseStop }) => {
        return (
            <Modal
                open={openStop}
                onClose={handleCloseStop}
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
                    <Typography id="modal-modal-title" variant="subtitile1">
                        ยืนยันการหยุดเป้าหมาย
                    </Typography>
                    <Typography gutterBottom id="modal-modal-description" variant="h6" >
                        {data.Name || ""}
                    </Typography>
                    <Container style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Button sx={{ backgroundColor: 'black', marginRight: 2 }} size="small" >
                            <Typography color='white' variant="subtitile1">
                                ตกลง
                            </Typography>
                        </Button>
                        <Button onClick={handleCloseStop} sx={{ backgroundColor: 'black' }} size="small" >
                            <Typography color='white' variant="subtitile1">
                                ยกเลิก
                            </Typography>
                        </Button>
                    </Container>
                </Container>
            </Modal>)
    }

    const [openDelete, setOpenDelete] = React.useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const ModalDelete = ({ openDelete, handleCloseDelete }) => {
        return (
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
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
                    <Typography id="modal-modal-title" variant="subtitile1">
                        ยืนยันการลบเป้าหมาย
                    </Typography>
                    <Typography gutterBottom id="modal-modal-description" variant="h6" >
                        {data.Name || ""}
                    </Typography>
                    <Container style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Button sx={{ backgroundColor: 'black', marginRight: 2 }} size="small" >
                            <Typography color='white' variant="subtitile1">
                                ตกลง
                            </Typography>
                        </Button>
                        <Button onClick={handleCloseDelete} sx={{ backgroundColor: 'black' }} size="small" >
                            <Typography color='white' variant="subtitile1">
                                ยกเลิก
                            </Typography>
                        </Button>
                    </Container>
                </Container>
            </Modal>)
    }

    return (
        <Card sx={{ minHeight: 300, minWidth: 300, paddingTop: 1, paddingBottom: 1, margin: 1 }}>
            <CardMedia
                component="img"
                height="100"
                image=""
                alt="icon/image"
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    ชื่อ : {data.Name || ""}
                </Typography>
                <Typography component="div" variant="subtitile1" color="text.secondary">
                    ระยะเวลาการลงทุน : {data.Period || ""}
                </Typography>
                <Typography component="div" variant="subtitile1" color="text.secondary">
                    เป้าหมาย : {data.Goal || ""}
                </Typography>
                <Typography component="div" variant="subtitile1" color="text.secondary">
                    วันที่สร้าง : {data.CreatedDate || ""}
                </Typography>
            </CardContent>
            <CardActions style={{ width: '100%', justifyContent: 'center', gap: '10%' }}>
                <Button onClick={handleOpenStop} sx={{ backgroundColor: 'black' }} size="small" >
                    <Typography color='white' variant="subtitile1">
                        หยุด
                    </Typography>
                </Button>
                <ModalStop openStop={openStop} handleCloseStop={handleCloseStop} />
                <Button onClick={handleOpenDelete} sx={{ backgroundColor: 'black' }} size="small" >
                    <Typography color='white' variant="subtitile1">
                        ลบ
                    </Typography>
                </Button>
                <ModalDelete openDelete={openDelete} handleCloseDelete={handleCloseDelete} />
            </CardActions>
        </Card >
    )
}

export default function GoalCard({ Goal }) {
    if (Object.keys(Goal).length > 0) {
        return (
            Goal.map((card) => (
                <EachCard key={card.Name} data={card} />
            ))
        )
    }
}
