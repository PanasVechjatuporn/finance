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
import OverlayLoading from "./OverlayLoading";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./EditMonthDataModal_Dashboard.css";
const baseURL = "http://localhost:8000";

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
        name: "อาหาร",
        category: 1,
        color: "#95c2dc",
        index: 1
    },
    {
        name: "ที่พักอาศัย",
        category: 2,
        color: "#ec843e",
        index: 2
    },
    {
        name: "สิ่งบันเทิง",
        category: 3,
        color: "#e7dc8c",
        index: 3
    },
    {
        name: "ท่องเที่ยว",
        category: 4,
        color: "#84ceb9",
        index: 4
    },
    {
        name: "การศึกษา",
        category: 5,
        color: "#6681a5",
        index: 5
    },
    {
        name: "ค่าเดินทาง",
        category: 6,
        color: "#fb7d7e",
        index: 6
    },
    {
        name: "ค่าใช้จ่ายจิปาถะ",
        category: 7,
        color: "#485ea1",
        index: 7
    },
    {
        name: "อื่นๆ",
        category: 8,
        color: "#b7f1a5",
        index: 8
    },
];

async function onSaveMonthData(
    userStore,
    incomeData,
    expenseData,
    investmentData,
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
        await validateMonthData(incomeData, expenseData, investmentData);
        if (isUseSameData === true) {
            let upsertData = [];
            for(let i=0;i< 12 - currentYearData.data.length; i++){
                upsertData.push({
                    user: {
                        userId: userStore.userId
                    },
                    currentDate: currentDate.split("-")[0]+"-"+String(parseInt(currentDate.split("-")[1]) + i).padStart(2,'0'),
                    incomeData,
                    expenseData,
                    investmentData,
                })
            }
            const resUpsert = await axios.post(
                `${baseURL}/db/upsert_multiple`,
                { upsertData },
                {
                    headers: {
                        Authorization: userStore.userToken,
                        UserId: userStore.userId
                    },
                }
            )
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
                investmentData,
            };
            const resUpsert = await axios.post(
                `${baseURL}/db/upsert_monthly`,
                { upsertData },
                {
                    headers: {
                        Authorization: userStore.userToken,
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
    const dataMonthCopy = dataMonth ? JSON.parse(JSON.stringify(dataMonth)) : dataMonth;
    const [incomeData, setIncomeData] = useState((dataMonthCopy && mode === "editexisting") ? dataMonthCopy.incomeData : [{}]);
    const [expenseData, setExpenseData] = useState((dataMonthCopy && mode === "editexisting") ? dataMonthCopy.expenseData : [{}]);
    const [investmentData, setInvestmentData] = useState((dataMonthCopy && mode === "editexisting") ? dataMonthCopy.investmentData : null);
    const [isLoading, setisLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState((dataMonthCopy && mode === "editexisting") ? dataMonthCopy.date : null);
    const [newMonthString, setNewMonthString] = useState((dataMonthCopy && mode === "editexisting") ? new Date(dataMonthCopy.date).toLocaleString("th-TH",{month: "long"}) : "");
    const [newYearString, setNewYearString] = useState((dataMonthCopy && mode === "editexisting") ? new Date(dataMonthCopy.date).getFullYear() : "");
    const [isUseSameData, setIsUseSameData] = useState(false);

    //back to initial state
    useEffect(() => {
        if (mode === "newmonth") {
            setIncomeData([{}]);
            setExpenseData([{}]);
            setInvestmentData(null);
            setIsUseSameData(false);
        }
        else{
            setCurrentDate(dataMonthCopy.date);
            setIncomeData(dataMonthCopy.incomeData);
            setExpenseData(dataMonthCopy.expenseData);
            setInvestmentData(dataMonthCopy.investmentData);
            setNewYearString(new Date(dataMonthCopy.date).getFullYear());
            setNewMonthString(
                new Date(dataMonthCopy.date).toLocaleString("th-TH", {
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
                ).toLocaleString("th-TH", {
                    month: "long",
                })
            );
        } 
        else {
            setCurrentDate(dataMonthCopy.date);
            setIncomeData(dataMonthCopy.incomeData);
            setExpenseData(dataMonthCopy.expenseData);
            setInvestmentData(dataMonthCopy.investmentData);
            setNewYearString(new Date(dataMonthCopy.date).getFullYear());
            setNewMonthString(
                new Date(dataMonthCopy.date).toLocaleString("th-TH", {
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
                        แก้ไขเดือน {newMonthString} ปี {newYearString}
                    </Modal.Title>
                ) : currentYearData ? (
                    <Modal.Title>
                        เพิ่มเดือน {newMonthString} ปี {newYearString}
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
                                    รายรับ
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
                                    เพิ่ม/แก้ไข แหล่งรายได้
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
                                                    sx={{ m: 1, minWidth: 200, maxWidth: 200 }}
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
                                                                {type.label}
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
                                    รายจ่าย
                                </Typography>
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecorationColor: "transparent",
                                        width: "100%",
                                    }}
                                >
                                    เพิ่ม/แก้ไข รายจ่ายเดือนนี้
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
                                                        sx={{ m: 1, maxWidth: 125, minWidth: 125 }}
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
                {mode === "newmonth" ? (
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isUseSameData}
                                    onChange={(e) => {
                                        console.log('e.target.checked :: ', e.target.checked)
                                        setIsUseSameData(e.target.checked)
                                    }
                                    }
                                />
                            }
                            label="ใช้ข้อมูลเดียวกันทั้งปี"
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
                                investmentData,
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
