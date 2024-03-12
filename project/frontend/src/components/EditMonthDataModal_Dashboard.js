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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./EditMonthDataModal_Dashboard.css";
const baseURL = "http://localhost:8000";
let monthString;
let year;
let month;
const taxableIncome = [
    {
        name: "เงินได้ประเภทที่ 1",
        category: 1,
        label: "เงินเดือน",
    },
    {
        name: "เงินได้ประเภทที่ 2",
        category: 2,
        label: "ค่าจ้างทั่วไป",
    },
    {
        name: "เงินได้ประเภทที่ 3",
        category: 3,
        label: "ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา",
        subcategory: [
            {
                subcategorylabel:
                    "ค่าลิขสิทธิ์/ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา/ค่าGoodwill",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 50% แต่ไม่เกิน 100,000 บาท หรือหักตามจริง",
            },
            {
                subcategorylabel: "เงินปีและเงินรายปีจากนิติกรรมหรือคำพิพากษาของศาล",
                subcategorycategory: 2,
                subcategoryinfo: "-",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 4",
        category: 4,
        label: "ดอกเบี้ย/เงินปันผล/ผลประโยชน์จากการลงทุน",
    },
    {
        name: "เงินได้ประเภทที่ 5",
        category: 5,
        label: "เงินได้จากการให้เช่าทรัพย์สิน",
        subcategory: [
            {
                subcategorylabel: "ค่าเช่าบ้าน/อาคาร/ตึก/สิ่งปลูกสร้าง/แพ",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าที่ดินเกษตรกรรม",
                subcategorycategory: 2,
                subcategoryinfo: "หักแบบเหมา 20% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าที่ดินไม่ใช้ในเกษตรกรรม",
                subcategorycategory: 3,
                subcategoryinfo: "หักแบบเหมา 15% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่ายานพาหนะ",
                subcategorycategory: 4,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าอื่นๆ",
                subcategorycategory: 5,
                subcategoryinfo: "หักแบบเหมา 10% หรือหักตามจริง",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 6",
        category: 6,
        label: "เงินได้จากวิชาชีพอิสระ",
        subcategory: [
            {
                subcategorylabel: "การประกอบโรคศิลปะ",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 60% หรือหักตามจริง",
            },
            {
                subcategorylabel: "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/บัญชี/ประณีตศิลปกรรม",
                subcategorycategory: 2,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 7",
        category: 7,
        label: "เงินได้จากการรับเหมา (ก่อสร้าง/รับผลิตสินค้า)",
    },
];

const expenseType = [
    {
        name: "รายจ่าย tmp 1",
        category: 1,
    },
    {
        name: "รายจ่าย tmp 2",
        category: 2,
    },
    {
        name: "รายจ่าย tmp 3",
        category: 3,
    },
    {
        name: "รายจ่าย tmp 4",
        category: 4,
    },
    {
        name: "รายจ่าย tmp 5",
        category: 5,
    },
    {
        name: "รายจ่าย tmp 6",
        category: 6,
    },
    {
        name: "รายจ่าย tmp 7",
        category: 7,
    },
    {
        name: "อื่นๆ",
        category: 0,
    },
];

async function onSaveMonthData(
    userStore,
    incomeData,
    expenseData,
    investmentData,
    currentDate,
    setisLoading
) {
    return new Promise((resolve, reject) => {
        try {
            setisLoading(true);
            Promise.all([validateMonthData(incomeData, expenseData, investmentData)])
                .then(() => {
                    const upsertData = {
                        user: {
                            userId: userStore.userId,
                        },
                        currentDate: currentDate,
                        incomeData,
                        expenseData,
                        investmentData,
                    };
                    try {
                        axios
                            .post(
                                `${baseURL}/db/upsert_monthly`,
                                {
                                    upsertData,
                                },
                                {
                                    headers: {
                                        Authorization: userStore.userToken,
                                    },
                                }
                            )
                            .then((res) => {
                                setisLoading(false);
                                resolve(res);
                            });
                    } catch (err) {
                        console.error("Error :: ", err);
                        setisLoading(false);
                        reject(err);
                    }
                })
                .catch((err) => {
                    console.error("Error saving data:", err);
                    setisLoading(false);
                    reject(err);
                });
        } catch (err) {
            console.error("Error :: ", err);
            setisLoading(false);
            reject(err);
        }
    });
}

function validateMonthData(incomeData, expenseData, investmentData) {
    return new Promise((resolve, reject) => {
        if (
            incomeData.length === 0 ||
            expenseData.length === 0 ||
            investmentData === ""
        ) {
            reject("Please fill in all the required fields");
        } else {
            resolve();
        }
    });
}

function OverlayLoading({ isLoading }) {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        setOpen(isLoading);
    }, [isLoading]);

    return (
        <div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

const EditMonthDataModal = ({
    show,
    onClose,
    clickedMonth,
    mode,
    currentYearData,
    selectedYear,
}) => {
    const userStore = useSelector((state) => state.userStore);
    const [incomeData, setIncomeData] = useState([{}]);
    const [expenseData, setExpenseData] = useState([{}]);
    const [investmentData, setInvestmentData] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(null);
    const [newMonthString, setNewMonthString] = useState('');
    const [newYearString, setNewYearString] = useState('');

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
        } else {
            setCurrentDate(clickedMonth.date);
            setIncomeData(clickedMonth.incomeData);
            setExpenseData(clickedMonth.expenseData);
            setInvestmentData(clickedMonth.investmentData);
        }
    }, [mode, selectedYear, currentYearData, clickedMonth]);

    useEffect(() => {
        if (currentYearData && mode === "newmonth") {
            //handle newmonth case
        } else if (currentYearData) {
            setNewMonthString(
                new Date(new Date().setMonth(currentYearData.data.length)).toLocaleString(
                    "en-us",
                    { month: "long" }
                )
            );
            setNewYearString(selectedYear);
        }
    }, [mode, selectedYear, currentYearData]);

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

    const handleInvestmentAmountChange = (e) => {
        setInvestmentData(e.target.value);
    };
    if (show === true && mode === "editexisting") {
        year = new Date(clickedMonth.date).getFullYear();
        month = new Date(clickedMonth.date).getMonth();
        monthString = new Date(clickedMonth.date).toLocaleString("en-us", {
            month: "long",
        });
    }

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
                        Editing {monthString} of {year}
                    </Modal.Title>
                ) : currentYearData ? (
                    <Modal.Title>
                        Adding {newMonthString} of {newYearString}
                    </Modal.Title>
                ) : null}
            </Modal.Header>
            <Modal.Body>
                <Container
                    style={{ overflowY: "auto", maxHeight: `calc(100vh - 200px)` }}
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
                                    Add/Edit Source of Income
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
                                                    label="รายได้"
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
                                                    sx={{ m: 1, minWidth: 150 }}
                                                >
                                                    <InputLabel id="income-type-label">
                                                        ประเภทของรายได้
                                                    </InputLabel>
                                                    <Select
                                                        labelId={"income-select-label" + index}
                                                        id="income-type-field"
                                                        onChange={(e) => {
                                                            handleIncomeTypeChange(e, index);
                                                        }}
                                                        label="ประเภทของรายได้"
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
                                                                {type.name}
                                                            </MenuItem>
                                                        ))}
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
                                Investment
                            </Typography>
                            <Typography
                                variant="h8"
                                style={{
                                    color: "#757575",
                                    textDecorationColor: "transparent",
                                    width: "100%",
                                }}
                            >
                                Add Investment Amount
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
                            </Container>
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
                                    Expense
                                </Typography>
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecorationColor: "transparent",
                                        width: "100%",
                                    }}
                                >
                                    Add/Edit Your Personal Expense
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
                                                        label="รายจ่าย"
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
                                                        sx={{ m: 1, minWidth: 150 }}
                                                    >
                                                        <InputLabel id="expense-type-label">
                                                            ประเภทของรายจ่าย
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
                                investmentData,
                                currentDate,
                                setisLoading
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
