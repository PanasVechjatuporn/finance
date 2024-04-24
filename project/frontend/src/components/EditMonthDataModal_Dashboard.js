import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { OverlayLoading } from "./OverlayLoading";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./EditMonthDataModal_Dashboard.css";
const baseURL = "http://localhost:8000";

const taxableIncome = [
    {
        "name": "Type of Income 1",
        "category": 1,
        "label": "Salary"
    },
    {
        "name": "Type of Income 2",
        "category": 2,
        "label": "General wages"
    },
    {
        "name": "Type of Income 3",
        "category": 3,
        "label": "Royalties and intellectual property rights",
        "subcategory": [
            {
                "subcategorylabel": "Royalties/Intellectual Property Rights/Goodwill",
                "subcategorycategory": 1,
                "subcategoryinfo": "Flat rate deduction 50%, but not exceeding 100,000 Baht or actual deduction"
            },
            {
                "subcategorylabel": "Annual and periodic payments from deeds or court judgments",
                "subcategorycategory": 2,
                "subcategoryinfo": "-"
            }
        ]
    },
    {
        "name": "Type of Income 4",
        "category": 4,
        "label": "Interest/Dividends/Investment returns"
    },
    {
        "name": "Type of Income 5",
        "category": 5,
        "label": "Income from property rental",
        "subcategory": [
            {
                "subcategorylabel": "House/building/structure/field/building/boat rental",
                "subcategorycategory": 1,
                "subcategoryinfo": "Flat rate deduction 30% or actual deduction"
            },
            {
                "subcategorylabel": "Agricultural land rental",
                "subcategorycategory": 2,
                "subcategoryinfo": "Flat rate deduction 20% or actual deduction"
            },
            {
                "subcategorylabel": "Non-agricultural land rental",
                "subcategorycategory": 3,
                "subcategoryinfo": "Flat rate deduction 15% or actual deduction"
            },
            {
                "subcategorylabel": "Vehicle rental",
                "subcategorycategory": 4,
                "subcategoryinfo": "Flat rate deduction 30% or actual deduction"
            },
            {
                "subcategorylabel": "Other rentals",
                "subcategorycategory": 5,
                "subcategoryinfo": "Flat rate deduction 10% or actual deduction"
            }
        ]
    },
    {
        "name": "Type of Income 6",
        "category": 6,
        "label": "Income from freelance work",
        "subcategory": [
            {
                "subcategorylabel": "Fine arts",
                "subcategorycategory": 1,
                "subcategoryinfo": "Flat rate deduction 60% or actual deduction"
            },
            {
                "subcategorylabel": "Legal/Engineering/Architecture/Accounting/Visual Arts",
                "subcategorycategory": 2,
                "subcategoryinfo": "Flat rate deduction 30% or actual deduction"
            }
        ]
    },
    {
        "name": "Type of Income 7",
        "category": 7,
        "label": "Income from contracts (construction/manufacturing)"
    }
];

const expenseType = [
    {
        "name": "Food",
        "category": 1,
        "color": "#95c2dc",
        "index": 1
    },
    {
        "name": "Accommodation",
        "category": 2,
        "color": "#ec843e",
        "index": 2
    },
    {
        "name": "Entertainment",
        "category": 3,
        "color": "#e7dc8c",
        "index": 3
    },
    {
        "name": "Travel",
        "category": 4,
        "color": "#84ceb9",
        "index": 4
    },
    {
        "name": "Education",
        "category": 5,
        "color": "#6681a5",
        "index": 5
    },
    {
        "name": "Transportation",
        "category": 6,
        "color": "#fb7d7e",
        "index": 6
    },
    {
        "name": "Miscellaneous expenses",
        "category": 7,
        "color": "#485ea1",
        "index": 7
    },
    {
        "name": "Others",
        "category": 8,
        "color": "#b7f1a5",
        "index": 8
    }
];


async function onSaveMonthData(
    userStore,
    incomeData,
    expenseData,
    // investmentData,
    currentDate,
    setisLoading,
    currentYearData,
    setCurrentYearData,
    userData,
    setUserData,
    isUseSameData
) {
    try {
        setisLoading(true);
        await validateMonthData(
            incomeData,
            expenseData
            // investmentData
        );
        if (isUseSameData === true) {
            let upsertData = [];
            for (let i = 0; i < 12 - currentYearData.data.length; i++) {
                upsertData.push({
                    user: {
                        userId: userStore.userId,
                    },
                    currentDate:
                        currentDate.split("-")[0] +
                        "-" +
                        String(parseInt(currentDate.split("-")[1]) + i).padStart(2, "0"),
                    incomeData,
                    expenseData,
                    // investmentData,
                });
            }
            const resUpsert = await axios.post(
                `${baseURL}/db/upsert_multiple`,
                { upsertData },
                {
                    headers: {
                        Authorization: userStore.userToken,
                        UserId: userStore.userId,
                    },
                }
            );
            const resFetchNewData = await axios.get(
                `${baseURL}/db/userdata_dashboard`,
                {
                    headers: {
                        Authorization: userStore.userToken,
                        userId: userStore.userId,
                        year: currentDate.split("-")[0],
                    },
                }
            );
            modifyUserDataByYear(
                currentDate.split("-")[0],
                resFetchNewData.data.queryResult,
                setUserData
            );
            setisLoading(false);
            return resUpsert;
        } else {
            const upsertData = {
                user: {
                    userId: userStore.userId,
                },
                currentDate: currentDate,
                incomeData,
                expenseData,
                // investmentData,
            };
            const resUpsert = await axios.post(
                `${baseURL}/db/upsert_monthly`,
                { upsertData },
                {
                    headers: {
                        Authorization: userStore.userToken,
                        UserId: userStore.userId,
                    },
                }
            );
            const resFetchNewData = await axios.get(
                `${baseURL}/db/userdata_dashboard`,
                {
                    headers: {
                        Authorization: userStore.userToken,
                        userId: userStore.userId,
                        year: currentDate.split("-")[0],
                    },
                }
            );
            modifyUserDataByYear(
                currentDate.split("-")[0],
                resFetchNewData.data.queryResult,
                setUserData
            );
            setisLoading(false);
            return resUpsert;
        }
    } catch (err) {
        console.error("Error saving data:", err);
        setisLoading(false);
        throw err;
    }
}

function validateMonthData(incomeData, expenseData, investmentData) {
    return new Promise((resolve, reject) => {
        if (incomeData.length === 0 || expenseData.length === 0) {
            reject("Please fill in all the required fields");
        } else {
            resolve();
        }
    });
}

function modifyUserDataByYear(yearToChange, newData, setUserData) {
    setUserData((prevState) => {
        return prevState.map((entry) => {
            if (entry.year === yearToChange) {
                return { ...entry, data: newData };
            }
            return entry;
        });
    });
}

const EditMonthDataModal = ({
    show,
    onClose,
    dataMonth,
    mode,
    currentYearData,
    selectedYear,
    setCurrentYearData,
    userData,
    setUserData,
}) => {
    const userStore = useSelector((state) => state.userStore);
    //set initial state
    const dataMonthCopy = dataMonth
        ? JSON.parse(JSON.stringify(dataMonth))
        : dataMonth;
    const [incomeData, setIncomeData] = useState(
        dataMonthCopy && mode === "editexisting" ? dataMonthCopy.incomeData : [{}]
    );
    const [expenseData, setExpenseData] = useState(
        dataMonthCopy && mode === "editexisting" ? dataMonthCopy.expenseData : [{}]
    );
    // const [investmentData, setInvestmentData] = useState((dataMonthCopy && mode === "editexisting") ? dataMonthCopy.investmentData : null);
    const [isLoading, setisLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(
        dataMonthCopy && mode === "editexisting" ? dataMonthCopy.date : null
    );
    const [newMonthString, setNewMonthString] = useState(
        dataMonthCopy && mode === "editexisting"
            ? new Date(dataMonthCopy.date).toLocaleString("en-US", { month: "long" })
            : ""
    );
    const [newYearString, setNewYearString] = useState(
        dataMonthCopy && mode === "editexisting"
            ? new Date(dataMonthCopy.date).getFullYear()
            : ""
    );
    const [isUseSameData, setIsUseSameData] = useState(false);

    //back to initial state
    useEffect(() => {
        if (mode === "newmonth") {
            setIncomeData([{}]);
            setExpenseData([{}]);
            // setInvestmentData(null);
            setIsUseSameData(false);
        } else {
            setCurrentDate(dataMonthCopy.date);
            setIncomeData(dataMonthCopy.incomeData);
            setExpenseData(dataMonthCopy.expenseData);
            // setInvestmentData(dataMonthCopy.investmentData);
            setNewYearString(new Date(dataMonthCopy.date).getFullYear());
            setNewMonthString(
                new Date(dataMonthCopy.date).toLocaleString("en-US", {
                    month: "long",
                })
            );
        }
    }, [show, mode]);

    useEffect(() => {
        if (mode === "newmonth") {
            setCurrentDate(
                selectedYear +
                "-" +
                String(
                    new Date(
                        new Date().setMonth(currentYearData.data.length)
                    ).getMonth() + 1
                ).padStart(2, "0")
            );
            setNewYearString(selectedYear);
            setNewMonthString(
                new Date(
                    new Date().setMonth(currentYearData.data.length)
                ).toLocaleString("en-US", {
                    month: "long",
                })
            );
        } else {
            setCurrentDate(dataMonthCopy.date);
            setIncomeData(dataMonthCopy.incomeData);
            setExpenseData(dataMonthCopy.expenseData);
            // setInvestmentData(dataMonthCopy.investmentData);
            setNewYearString(new Date(dataMonthCopy.date).getFullYear());
            setNewMonthString(
                new Date(dataMonthCopy.date).toLocaleString("en-US", {
                    month: "long",
                })
            );
        }
    }, [mode, selectedYear, currentYearData, dataMonth, userData]);

    const handleDeleteIncomeAtIndex = (index) => {
        let tmpIncomeData = [...incomeData];
        tmpIncomeData.splice(index, 1);
        setIncomeData(tmpIncomeData);
    };

    const handleAddIncomeData = () => {
        setIncomeData((prevIncomeData) => [...prevIncomeData, {}]);
    };

    const handleIncomeAmountChange = (e, index) => {
        let tmpIncomeData = [...incomeData];
        tmpIncomeData[index].amount = e.target.value;
        setIncomeData(tmpIncomeData);
    };

    const handleIncomeTypeChange = (e, index) => {
        let tmpIncomeData = [...incomeData];
        tmpIncomeData[index].type = e.target.value;
        setIncomeData(tmpIncomeData);
    };

    const handleIncomeSubTypeChange = (e, index) => {
        let tmpIncomeData = [...incomeData];
        tmpIncomeData[index].subType = e.target.value;
        console.log('incomedata[index] :: ',tmpIncomeData[index])
        setIncomeData(tmpIncomeData);
    };

    const handleDeleteExpenseAtIndex = (index) => {
        let tmpExpenseData = [...expenseData];
        tmpExpenseData.splice(index, 1);
        setExpenseData(tmpExpenseData);
    };

    const handleAddExpenseData = () => {
        setExpenseData((prevExpenseData) => [...prevExpenseData, {}]);
    };

    const handleExpenseAmountChange = (e, index) => {
        let tmpExpenseData = [...expenseData];
        tmpExpenseData[index].amount = e.target.value;
        setExpenseData(tmpExpenseData);
    };

    const handleExpenseTypeChange = (e, index) => {
        let tmpExpenseData = [...expenseData];
        tmpExpenseData[index].type = e.target.value;
        setExpenseData(tmpExpenseData);
    };

    // const handleInvestmentAmountChange = (e) => {
    //     setInvestmentData(e.target.value);
    // };

    return (
        <Modal
            show={show}
            onHide={() => {
                onClose();
            }}
            backdrop="static"
            className="edit-modal"
        >
            <OverlayLoading isLoading={isLoading} />
            <Modal.Header closeButton>
                {mode === "editexisting" ? (
                    <Modal.Title>
                        Edit for the month {newMonthString} Year {newYearString}
                    </Modal.Title>
                ) : currentYearData ? (
                    <Modal.Title>
                        Add month {newMonthString} Year {newYearString}
                    </Modal.Title>
                ) : null}
            </Modal.Header>
            <Modal.Body>
                <Container
                    style={{
                        overflowY: "auto",
                        maxHeight: `calc(100vh - 200px)`,
                        maxWidth: "100%",
                    }}
                >
                    <Row>
                        {/* Income */}
                        <Col md={6}>
                            <div>
                                <Typography
                                    variant="h4"
                                    style={{
                                        color: "#757575",
                                        textDecoration: "underline",
                                        textDecorationColor: "transparent",
                                        borderBottom: "2px solid #757575",
                                        display: "inline-block",
                                        width: "100%",
                                        paddingBottom: "8px",
                                        userSelect: "none",
                                    }}
                                >
                                    Income
                                </Typography>
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecorationColor: "transparent",
                                        width: "100%",
                                        userSelect: "none",
                                    }}
                                >
                                    Add/Modify revenue sources
                                </Typography>
                            </div>
                            <Container>
                                {incomeData.length > 0 ? (
                                    incomeData.map((data, index) => (
                                        <Grid container spacing={2} key={index} alignItems="center">
                                            <Grid item>
                                                <TextField
                                                    required
                                                    id={"income-amount" + index}
                                                    label="Income"
                                                    size="small"
                                                    margin="normal"
                                                    onChange={(e) => {
                                                        handleIncomeAmountChange(e, index);
                                                    }}
                                                    value={
                                                        incomeData[index].amount
                                                            ? incomeData[index].amount
                                                            : ""
                                                    }
                                                />
                                            </Grid>
                                            <Grid item>
                                                <FormControl
                                                    variant="standard"
                                                    sx={{ m: 1, minWidth: 160, maxWidth: 160 }}
                                                >
                                                    <InputLabel id="income-type-label">
                                                        Income type
                                                    </InputLabel>
                                                    <Select
                                                        labelId={"income-select-label" + index}
                                                        id="income-type-field"
                                                        onChange={(e) => {
                                                            handleIncomeTypeChange(e, index);
                                                        }}
                                                        label="Income type"
                                                        value={
                                                            incomeData[index].type
                                                                ? incomeData[index].type
                                                                : ""
                                                        }
                                                    >
                                                        {taxableIncome.map((type) => (
                                                            <MenuItem
                                                                value={type.category}
                                                                key={type.name + index}
                                                            >
                                                                {type.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <FormControl
                                                    variant="standard"
                                                    sx={{ m: 1, minWidth: 160, maxWidth: 160 }}
                                                >
                                                    <InputLabel id="income-type-sub-label">
                                                        Income Subcategories
                                                    </InputLabel>
                                                    <Select
                                                        labelId={"income-select-sub-label" + index}
                                                        id="income-type-sub-field"
                                                        onChange={(e) => {
                                                            console.log('e :: ',e.target.value)
                                                            handleIncomeSubTypeChange(e, index);
                                                        }}
                                                        label="ประเภทของรายได้ย่อย"
                                                        value={
                                                            incomeData[index].subType
                                                                ? incomeData[index].subType
                                                                : ""
                                                        }
                                                        disabled={!taxableIncome.filter(obj => obj.category === incomeData[index].type).some(filtered => filtered.hasOwnProperty('subcategory'))}
                                                    >
                                                        {
                                                            taxableIncome.map((type) => {
                                                                if (incomeData[index].type === type.category && type && type.hasOwnProperty("subcategory")) {
                                                                    return type.subcategory.map((subType) => (
                                                                        <MenuItem
                                                                            value={subType.subcategorycategory}
                                                                            key={subType.subcategorycategory + index + subType.subcategorylabel}
                                                                        >
                                                                            {subType.subcategorylabel}
                                                                        </MenuItem>
                                                                    ));
                                                                } else {
                                                                    return null; // Return null if the conditions are not met
                                                                }
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    children={<DeleteIcon></DeleteIcon>}
                                                    onClick={() => {
                                                        handleDeleteIncomeAtIndex(index);
                                                    }}
                                                ></IconButton>
                                            </Grid>
                                        </Grid>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </Container>
                            <Row>
                                <IconButton
                                    variant="text"
                                    children={<AddCircleOutlineIcon></AddCircleOutlineIcon>}
                                    onClick={() => {
                                        handleAddIncomeData();
                                    }}
                                ></IconButton>
                            </Row>

                            {/* <Typography
                                variant="h4"
                                style={{
                                    color: "#757575",
                                    textDecoration: "underline",
                                    textDecorationColor: "transparent",
                                    borderBottom: "2px solid #757575",
                                    display: "inline-block",
                                    width: "100%",
                                    paddingBottom: "8px",
                                }}
                            >
                                เงินลงทุน
                            </Typography>
                            <Typography
                                variant="h8"
                                style={{
                                    color: "#757575",
                                    textDecorationColor: "transparent",
                                    width: "100%",
                                }}
                            >
                                เพิ่มจำนวนเงินลงทุนเดือนนี้
                            </Typography>
                            <Container>
                                <Grid container spacing={2} alignItems="center">
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                                        <TextField
                                            required
                                            id={"investment-amount"}
                                            label="เงินลงทุนเดือนนี้"
                                            size="small"
                                            margin="normal"
                                            onChange={(e) => {
                                                handleInvestmentAmountChange(e);
                                            }}
                                            value={investmentData ? investmentData : ""}
                                        />
                                    </FormControl>
                                </Grid>
                            </Container> */}
                        </Col>
                        {/* Expense */}
                        <Col md={6}>
                            <div>
                                <Typography
                                    variant="h4"
                                    style={{
                                        color: "#757575",
                                        textDecoration: "underline",
                                        textDecorationColor: "transparent",
                                        borderBottom: "2px solid #757575",
                                        display: "inline-block",
                                        width: "100%",
                                        paddingBottom: "8px",
                                    }}
                                >
                                    Expenses
                                </Typography>
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecorationColor: "transparent",
                                        width: "100%",
                                    }}
                                >
                                    Increase/Edit expenses for this month
                                </Typography>
                                <Container>
                                    {expenseData.length > 0 ? (
                                        expenseData.map((data, index) => (
                                            <Grid
                                                container
                                                spacing={2}
                                                key={index}
                                                alignItems="center"
                                            >
                                                <Grid item>
                                                    <TextField
                                                        required
                                                        id={"expense-amount" + index}
                                                        label="Expense"
                                                        size="small"
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            handleExpenseAmountChange(e, index);
                                                        }}
                                                        value={
                                                            expenseData[index].amount
                                                                ? expenseData[index].amount
                                                                : ""
                                                        }
                                                    />
                                                </Grid>
                                                {/* income type */}
                                                <Grid item>
                                                    <FormControl
                                                        variant="standard"
                                                        sx={{ m: 1, maxWidth: 125, minWidth: 125 }}
                                                    >
                                                        <InputLabel id="expense-type-label">
                                                            Expense catergory
                                                        </InputLabel>
                                                        <Select
                                                            labelId={"expense-select-label" + index}
                                                            id="expense-type-field"
                                                            onChange={(e) => {
                                                                handleExpenseTypeChange(e, index);
                                                            }}
                                                            label="ประเภทของรายจ่าย"
                                                            value={
                                                                expenseData[index].type
                                                                    ? expenseData[index].type
                                                                    : ""
                                                            }
                                                        >
                                                            {expenseType.map((type) => (
                                                                <MenuItem
                                                                    value={type.category}
                                                                    key={type.name + index}
                                                                >
                                                                    {type.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                {/* delete button */}
                                                <Grid item>
                                                    <IconButton
                                                        children={<DeleteIcon></DeleteIcon>}
                                                        onClick={() => {
                                                            handleDeleteExpenseAtIndex(index);
                                                        }}
                                                    ></IconButton>
                                                </Grid>
                                            </Grid>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </Container>
                                <Row>
                                    <IconButton
                                        variant="text"
                                        children={<AddCircleOutlineIcon></AddCircleOutlineIcon>}
                                        onClick={() => {
                                            handleAddExpenseData();
                                        }}
                                    ></IconButton>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                {mode === "newmonth" ? (
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isUseSameData}
                                    onChange={(e) => {
                                        setIsUseSameData(e.target.checked);
                                    }}
                                />
                            }
                            label="Use the same data for whole year"
                        />
                    </FormGroup>
                ) : null}
                <Button
                    variant="secondary"
                    onClick={() => {
                        onClose();
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={async () => {
                        try {
                            await onSaveMonthData(
                                userStore,
                                incomeData,
                                expenseData,
                                // investmentData,
                                currentDate,
                                setisLoading,
                                currentYearData,
                                setCurrentYearData,
                                userData,
                                setUserData,
                                isUseSameData
                            );
                            onClose();
                        } catch (err) {
                            alert(err);
                        }
                    }}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditMonthDataModal;
