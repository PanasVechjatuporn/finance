import React from "react";
import { Link } from "react-router-dom";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, CardActionArea, CardActions, TextField } from "@mui/material";
import GoalCard from "components/GoalCard";
//import mockGoal from "mockupData/mockGoal.json"
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const warnTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export const GoalBased = () => {
  const navigate = useNavigate();

  const uid = useSelector((state) => state.userStore.userId);
  const [data, setData] = React.useState([]);
  const [goal, setGoal] = React.useState([]);
  const [isloading, setIsloading] = React.useState(true);

  const [isItNormal, setIsitNormal] = React.useState();

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
          });
        setIsloading(false);
      }
    }
    fetchData();
  }, [uid]);

  function handleGoalTypeClick(type) {
    if (type == "normal") {
      setIsitNormal(true);
    } else if (type == "tax") {
      setIsitNormal(false);
    }

    if (goal.length > 0) {
      handleOpenNewGoal();
    } else {
      if (type == "normal") {
        navigate("./normal-goal", { state: { Percentage: 100 } });
      } else if (type == "tax") {
        navigate("./reduce-tax-goal", {
          state: { Percentage: 100, data: data },
        });
      }
    }
  }

  function handleCreateGoal() {
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
      if (isItNormal == true) {
        handleCloseNewGoal();
        navigate("./normal-goal", { state: { Percentage: goalPercent, goal: oldGoal } });
        event.preventDefault();
      } else if (isItNormal == false) {
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
    if (sumPercent != 100) {
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
                          console.log(oldGoal);
                        } else if (!e.target.value) {
                          let updatedGoal = [...oldGoal];
                          updatedGoal[index].Percentage = "";
                          setOldGoal(updatedGoal);
                          console.log(oldGoal);
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
              {Exceed == true ? (
                <Button
                  disable="true"
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
            สร้างเป้าหมายเพื่อลดภาษี
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
                ไม่
              </Typography>
            </Button>
            <Button
              onClick={(e) => handleGoalTypeClick("tax")}
              sx={{ backgroundColor: "black" }}
              size="small"
            >
              <Typography color="white" variant="subtitile1">
                ใช่
              </Typography>
            </Button>
          </Container>
        </Container>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      <Navigate />
      {isloading == false && (
        <Container
          style={{
            display: "flex",
            marginTop: 20,
            paddingTop: 10,
            paddingBottom: 10,
            width: "70%",
            maxHeight: 400,
            overflow: "auto",
            backgroundColor: "#F0F0F0",
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
              <Button
                onClick={handleCreateGoal}
                sx={{ backgroundColor: "black" }}
                size="large"
              >
                <Typography color="white" variant="subtitile1">
                  สร้างเป้าหมาย
                </Typography>
              </Button>
              <ModalCreate
                openCreate={openCreate}
                handleCloseCreate={handleCloseCreate}
              />
              <ModalNewGoal open={openNewGoal} close={handleCloseNewGoal} />
            </CardActions>
          </Card>
        </Container>
      )}
    </React.Fragment>
  );
};
