import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Container } from "react-bootstrap";
import { Button } from "@mui/material";

export const RiskProfilePromptModal = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const onCloseRiskProfilePromptModal = () => {
        setIsOpen(false)
    }
    return (
        <Modal
            open={isOpen}
            onClose={onCloseRiskProfilePromptModal}
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
                    คุณยังไม่ได้เริ่มทำแบบสอบถามความเสี่ยงในการลงทุน
                    ต้องการเริ่มทำแบบสอบถามก่อนหรือไม่
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
                        onClick={(e) => {
                            setIsOpen(false)
                            navigate('/Goal-Based/risk-evaluation-normal')
                        }
                    }
                        sx={{ backgroundColor: "black", marginRight: 2 }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ใช่
                        </Typography>
                    </Button>
                    <Button
                        onClick={(e) => setIsOpen(false)}
                        sx={{ backgroundColor: "grey" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ไม่
                        </Typography>
                    </Button>
                </Container>
            </Container>
        </Modal>
    );
};
