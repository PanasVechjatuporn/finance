import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Box, Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CustomChartLegend from "./CustomChartLegend_Dashboard";
import PieChartInfoModal from "./PieChartInfoModal_Dashboard";
const taxableIncome = [
    {
        name: "เงินได้ประเภทที่ 1",
        category: 1,
        label: "เงินเดือน",
        color: "#ac00fd",
    },
    {
        name: "เงินได้ประเภทที่ 2",
        category: 2,
        label: "ค่าจ้างทั่วไป",
        color: "#e000d7",
    },
    {
        name: "เงินได้ประเภทที่ 3",
        category: 3,
        label: "ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา",
        color: "#ff56c1",
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
        color: "#ff266a",
    },
    {
        name: "เงินได้ประเภทที่ 5",
        category: 5,
        label: "เงินได้จากการให้เช่าทรัพย์สิน",
        color: "#fd7a1a",
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
        color: "#32a6fb",
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
        color: "#566dff",
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

export default function PieChartComponent({ userData }) {
    const [highlighted] = useState("item");
    const [currentYear, setCurrentYear] = useState(
        userData ? userData[0].year : null
    );
    const [pieExpenseParams, setPieExpenseParams] = useState(null);
    const [pieIncomeParams, setPieIncomeParams] = useState(null);
    const [incomePieData, setIncomePieData] = useState(null);
    const [expensePieData, setExpensePieData] = useState(null);
    const [modalParams, setModalParams] = useState(null);
    const [showPieChartModal, setShowPieChartModal] = useState(false);
    const [modalType, setModalType] = useState(null)

    useEffect(() => {
        if (userData && !currentYear) {
            setCurrentYear(userData[0].year);
        } else if (userData) {
            if (userData[0].data.length > 0) {
                const currentYearData = userData.filter(
                    (item) => item.year === currentYear
                )[0].data;
                let yearlyIncome = 0;
                let yearlyExpense = 0;
                let incomePieData = [];
                let expensePieData = [];
                let incomeSourceEntries = [];
                let expenseSourceEntries = [];
                currentYearData.forEach(
                    ({ incomeData, expenseData, investmentData, date }) => {
                        //incomeData
                        incomeData.forEach((incomeSource) => {
                            incomeSourceEntries.push({
                                amount: incomeSource.amount,
                                date: date,
                                type: incomeSource.type,
                            });

                            const existingEntry = incomePieData.find(
                                (entry) => entry.type === incomeSource.type
                            );

                            const incomeTypeLabel = taxableIncome.find(
                                (entry) => entry.category === incomeSource.type
                            ).label;

                            const incomeTypeColor = taxableIncome.find(
                                (entry) => entry.category === incomeSource.type
                            ).color;

                            if (existingEntry) {
                                existingEntry.value += parseFloat(incomeSource.amount);
                            } else {
                                incomePieData.push({
                                    type: incomeSource.type,
                                    value: parseFloat(incomeSource.amount),
                                    label: incomeTypeLabel,
                                    color: incomeTypeColor,
                                });
                            }
                            yearlyIncome += parseFloat(incomeSource.amount);
                        });

                        //expenseData
                        expenseData.forEach((expenseSource) => {
                            expenseSourceEntries.push({
                                amount: expenseSource.amount,
                                date: date,
                                type: expenseSource.type,
                            });

                            const existingEntry = expensePieData.find(
                                (entry) => entry.type === expenseSource.type
                            );
                            const expenseTypeLabel = expenseType.find(
                                (entry) => entry.category === expenseSource.type
                            ).name;
                            const expenseTypeColor = expenseType.find(
                                (entry) => entry.category === expenseSource.type
                            ).color;
                            if (existingEntry) {
                                existingEntry.value += parseFloat(expenseSource.amount);
                            } else {
                                expensePieData.push({
                                    type: expenseSource.type,
                                    value: parseFloat(expenseSource.amount),
                                    label: expenseTypeLabel,
                                    color: expenseTypeColor,
                                });
                            }
                            yearlyExpense += parseFloat(expenseSource.amount);
                        });
                        //investmentData
                    }
                );
                const incomeEntries = {};
                incomeSourceEntries.forEach((entry) => {
                    if (!incomeEntries[entry.type]) {
                        incomeEntries[entry.type] = [];
                    }
                    incomeEntries[entry.type].push(entry);
                });

                const expenseEntries = {};
                expenseSourceEntries.forEach((entry) => {
                    if (!expenseEntries[entry.type]) {
                        expenseEntries[entry.type] = [];
                    }
                    expenseEntries[entry.type].push(entry);
                });

                incomePieData.forEach((data, index) => {
                    incomePieData[index].monthEntries =
                        incomeEntries[incomePieData[index].type];
                });

                expensePieData.forEach((data, index) => {
                    expensePieData[index].monthEntries =
                        expenseEntries[expensePieData[index].type];
                });

                setIncomePieData(incomePieData);
                setExpensePieData(expensePieData);
                setPieIncomeParams({
                    series: [
                        {
                            data: incomePieData,
                            highlighted: { additionalRadius: 10 },
                            arcLabel: (item) =>
                                Math.round(
                                    ((item.value / yearlyIncome) * 100 + Number.EPSILON) * 10
                                ) /
                                10 +
                                "%",
                            arcLabelMinAngle: 25,
                        },
                    ],
                    height: 400,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    margin: { top: 50, bottom: 50 },
                    sx: {
                        [`& .${pieArcLabelClasses.root}`]: {
                            fill: "black",
                            fontWeight: "bold",
                        },
                    },
                });
                setPieExpenseParams({
                    series: [
                        {
                            data: expensePieData,
                            highlighted: { additionalRadius: 10 },
                            arcLabel: (item) =>
                                Math.round(
                                    ((item.value / yearlyExpense) * 100 + Number.EPSILON) * 10
                                ) /
                                10 +
                                "%",
                            arcLabelMinAngle: 30,
                        },
                    ],
                    height: 400,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    margin: { top: 50, bottom: 50 },
                    sx: {
                        [`& .${pieArcLabelClasses.root}`]: {
                            fill: "black",
                            fontWeight: "bold",
                        },
                    },
                });
            }
        }
    }, [userData, currentYear]);

    const handleOnClickIncomePieChart = (modalParams) => {
        setModalParams(modalParams)
        setModalType("income")
        setShowPieChartModal(true)
    }

    const handleOnClickExpensePieChart = (modalParams) => {
        setModalParams(modalParams)
        setModalType("expense")
        setShowPieChartModal(true)
    }

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minWidth: "90vh",
                    minHeight: "90vh",
                    maxWidth: "90vh",
                    maxHeight: "90vh",
                    borderRadius: 6,
                    boxShadow: 6,
                    position: "relative",
                }}
            >
                <Container>
                    <FormControl
                        sx={{
                            position: "absolute",
                            right: "5%",
                            width: "15%",
                            height: "10%"
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select-year"
                            value={currentYear ? currentYear : ""}
                            label="Select Year"
                            onChange={(e) => {
                                setCurrentYear(e.target.value);
                            }}
                        >
                            {userData
                                ? userData.map((data, index) => (
                                    <MenuItem value={data.year} key={index + data.year}>
                                        {data.year}
                                    </MenuItem>
                                ))
                                : null}
                        </Select>
                    </FormControl>
                </Container>
                <Container>
                    <Typography
                        variant="h5"
                        style={{
                            color: "#757575",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            borderBottom: "2px solid #757575",
                            display: "inline-block",
                            width: "100%",
                            userSelect: "none",
                            fontWeight: "bold",
                            paddingBottom: "2%",

                        }}
                        sx={{
                            paddingTop: 1,
                        }}
                    >
                        สรุปรายรับ ปี {currentYear}
                    </Typography>
                </Container>

                {pieIncomeParams ? (
                    <Container style={{ marginLeft: "10%" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ flex: 1 }}>
                                <PieChart
                                    {...pieIncomeParams}
                                    series={pieIncomeParams.series.map((series) => ({
                                        ...series,
                                        highlightScope: {
                                            highlighted,
                                        },
                                        cornerRadius: 5,
                                    }))}
                                    slotProps={{ legend: { hidden: true } }}
                                    onClick={(data, index) => {
                                        handleOnClickIncomePieChart(pieIncomeParams.series[0].data[index.dataIndex]);
                                    }}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'bold',
                                        }
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1, padding: 10, marginTop: 80 }}>
                                <CustomChartLegend data={incomePieData} taxableIncome={taxableIncome} />
                            </div>
                        </div>
                    </Container>

                ) : (
                    <Container
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '18%',
                            marginBottom: '20%'
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            ไม่พบข้อมูล
                        </Typography>
                    </Container>
                )}
                <Container>
                    <Typography
                        variant="h5"
                        style={{
                            color: "#757575",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            borderBottom: "2px solid #757575",
                            display: "inline-block",
                            width: "100%",
                            userSelect: "none",
                            fontWeight: "bold"
                        }}
                        sx={{
                            padding: 1
                        }}
                    >
                        สรุปรายจ่าย ปี {currentYear}
                    </Typography>
                </Container>
                {pieExpenseParams ? (
                    <Container style={{ marginLeft: "10%" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ flex: 1 }}>
                                <PieChart
                                    {...pieExpenseParams}
                                    series={pieExpenseParams.series.map((series) => ({
                                        ...series,
                                        highlightScope: {
                                            highlighted,
                                        },
                                        cornerRadius: 5,
                                    }))}
                                    slotProps={{ legend: { hidden: true } }}
                                    onClick={(data, index) => {
                                        handleOnClickExpensePieChart(pieExpenseParams.series[0].data[index.dataIndex]);
                                    }}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1, marginTop: 80 }}>
                                <CustomChartLegend data={expensePieData} expenseType={expenseType} />
                            </div>
                        </div>
                    </Container>

                ) : (
                    <Container
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '20%',
                            marginBottom: '20%'
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            ไม่พบข้อมูล
                        </Typography>
                    </Container>
                )}
                <PieChartInfoModal open={showPieChartModal} setOpen={setShowPieChartModal} modalParams={modalParams} modalType={modalType}></PieChartInfoModal>
            </Box>
        </Container>
    );
}
