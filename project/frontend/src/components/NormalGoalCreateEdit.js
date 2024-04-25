import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const baseURL = "http://localhost:8000";

async function saveNewNormalGoal(goalData, userStore) {
    await axios.post(
        `${baseURL}/db/create_new_normal_goal`,
        {
            goalData
        },
        {
            headers: {
                Authorization: userStore.userToken,
                UserId: userStore.userId,
            },
        }
    );
}

export const NormalGoalCreateEdit = ({ goalData, setGoalData, mode }) => {
    const navigate = useNavigate();
    const userStore = useSelector((state) => state.userStore);
    const [nameError, setNameError] = useState(false);
    const [goalError, setGoalError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [tempGoalName, setTempGoalName] = useState(goalData.Name);
    useEffect(() => {
        setTempGoalName(goalData.Name)
    }, [mode])
    const onSaveNewGoal = async (goalData) => {
        if (!goalData.Name) {
            setNameError(true);
        } else {
            setNameError(false);
        }

        if (!goalData.Goal) {
            setGoalError(true);
        } else {
            setGoalError(false);
        }

        if (parseInt(new Date(goalData.GoalTime).getFullYear()) - parseInt(new Date(goalData.CreatedDate).getFullYear()) === 0) {
            setTimeError(true);
        } else {
            setTimeError(false);
        }

        if (goalData.Name && goalData.Goal && parseInt(new Date(goalData.GoalTime).getFullYear()) - parseInt(new Date(goalData.CreatedDate).getFullYear()) !== 0) {
            await saveNewNormalGoal(goalData, userStore);
            navigate("/Goal-Based")
        }
    }

    return (
        <Container
            sx={{
                marginTop: "10%",
                minHeight: "55vh",
                display: "ruby-text",
            }}
        >
            <Box
                sx={{
                    minWidth: "100%",
                    minHeight: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: 6,
                    boxShadow: 6,
                    padding: 4,
                    position: "relative",
                    overflow: "auto",
                    justifyContent: "center",
                }}
            >
                <div>
                    <Typography
                        variant="h5"
                        style={{
                            color: "#757575",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            borderBottom: "2px solid #757575",
                            width: "100%",
                            paddingBottom: "8px",
                            userSelect: "none",
                            marginBottom: "15px",
                            fontWeight: "bold",
                        }}
                    >
                        {mode === "new" ? "Create a goal" : "Edit goal " + tempGoalName}
                    </Typography>
                </div>
                <Container>
                    <TextField
                        required
                        id={"goal-name"}
                        label="Goal name"
                        size="small"
                        margin="normal"
                        error={nameError}
                        helperText={nameError ? "Please fill a name" : ""}
                        onChange={(e) => {
                            let tmp = JSON.parse(JSON.stringify(goalData))
                            tmp.Name = e.target.value
                            setNameError(false)
                            setGoalData(tmp)
                        }}
                        value={
                            goalData.Name
                        }
                    />
                    <TextField
                        required
                        id={"goal-goal"}
                        label="Price (Baht)"
                        size="small"
                        type="number"
                        margin="normal"
                        error={goalError}
                        disabled = {mode === "edit" ? true : false}
                        helperText={goalError ? "Please fill a goal" : ""}
                        onChange={(e) => {
                            let tmp = JSON.parse(JSON.stringify(goalData))
                            tmp.Goal = e.target.value
                            setGoalError(false)
                            setGoalData(tmp)
                        }}
                        value={
                            goalData.Goal
                        }
                    />
                    <TextField
                        required
                        id={"goal-time"}
                        label="Duration (Year)"
                        size="small"
                        margin="normal"
                        type="number"
                        error={timeError}
                        disabled = {mode === "edit" ? true : false}
                        helperText={timeError ? "More than 0" : ""}
                        onChange={(e) => {
                            let tmp = JSON.parse(JSON.stringify(goalData))
                            let goalCreatedDate = new Date(goalData.CreatedDate)
                            goalCreatedDate.setFullYear(parseInt(goalCreatedDate.getFullYear()) + parseInt(e.target.value))
                            tmp.GoalTime = goalCreatedDate
                            setTimeError(false)
                            setGoalData(tmp)
                        }}
                        value={
                            parseInt(new Date(goalData.GoalTime).getFullYear()) - parseInt(new Date(goalData.CreatedDate).getFullYear())
                        }
                    />
                </Container>
                <Container>
                    <Button
                        variant="contained"
                        endIcon={<SaveIcon />}
                        onClick={(e) => {
                            onSaveNewGoal(goalData)
                        }}
                    >
                        Save
                    </Button>
                </Container>
            </Box>
        </Container>
    );
};
