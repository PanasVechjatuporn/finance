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
import { formatNumberWithCommas } from "utils/numberUtil";
const taxableIncome = [
    {
        name: "Salary type 1",
        category: 1,
        label: "Salary",
        color: "#ac00fd",
    },
    {
        name: "Salary type 2",
        category: 2,
        label: "General Income",
        color: "#e000d7",
    },
    {
        name: "Salary type 3",
        category: 3,
        label: "Intellectual property rights and assets",
        color: "#ff56c1",
        subcategory: [
            {
                subcategorylabel:
                    "Copyright fees/intellectual property rights and assets/intangible assets/Goodwill expenses",
                subcategorycategory: 1,
                subcategoryinfo: "Deduct at a flat rate of 50%, but not exceeding 100,000 baht, or deduct based on actual expenses.",
            },
            {
                subcategorylabel: "Annual and periodic payments from legal settlements or court judgments",
                subcategorycategory: 2,
                subcategoryinfo: "-",
            },
        ],
    },
    {
        name: "Salary type 4",
        category: 4,
        label: "Interest/dividends/investment returns",
        color: "#ff266a",
    },
    {
        name: "Salary type 5",
        category: 5,
        label: "Income from property rental",
        color: "#fd7a1a",
        subcategory: [
            {
                subcategorylabel: "House/building/structure/building/pond rental expenses",
                subcategorycategory: 1,
                subcategoryinfo: "Deduct at a flat rate of 30% or deduct based on actual expenses.",
            },
            {
                subcategorylabel: "Agricultural land rental expenses",
                subcategorycategory: 2,
                subcategoryinfo: "educt at a flat rate of 20% or deduct based on actual expenses.",
            },
            {
                subcategorylabel: "Land rental not used in agriculture",
                subcategorycategory: 3,
                subcategoryinfo: "Deduct at a flat rate of 15% or deduct based on actual expenses.",
            },
            {
                subcategorylabel: "Vehicle rental expenses",
                subcategorycategory: 4,
                subcategoryinfo: "Deduct at a flat rate of 30% or deduct based on actual expenses.",
            },
            {
                subcategorylabel: "Other rental expenses",
                subcategorycategory: 5,
                subcategoryinfo: "Deduct at a flat rate of 10% or deduct based on actual expenses.",
            },
        ],
    },
    {
        name: "Salary type 6",
        category: 6,
        label: "Income from freelance profession",
        color: "#32a6fb",
        subcategory: [
            {
                subcategorylabel: "The practice of medicine.",
                subcategorycategory: 1,
                subcategoryinfo: "Deduct at a flat rate of 60% or deduct based on actual expenses.",
            },
            {
                subcategorylabel: "Law/Engineering/Architecture/Accounting/Fine Arts",
                subcategorycategory: 2,
                subcategoryinfo: "Deduct at a flat rate of 30% or deduct based on actual expenses.",
            },
        ],
    },
    {
        name: "Salary type 7",
        category: 7,
        label: "Earnings from contracts (construction/manufacturing)",
        color: "#566dff",
    },
];

const expenseType = [
    {
        name: "Food",
        category: 1,
        color: "#95c2dc",
        index: 1
    },
    {
        name: "Residence",
        category: 2,
        color: "#ec843e",
        index: 2
    },
    {
        name: "Entertainment",
        category: 3,
        color: "#e7dc8c",
        index: 3
    },
    {
        name: "Travel/Tourism",
        category: 4,
        color: "#84ceb9",
        index: 4
    },
    {
        name: "Education",
        category: 5,
        color: "#6681a5",
        index: 5
    },
    {
        name: "Travel expenses",
        category: 6,
        color: "#fb7d7e",
        index: 6
    },
    {
        name: "Miscellaneous expenses",
        category: 7,
        color: "#485ea1",
        index: 7
    },
    {
        name: "Etcetera",
        category: 8,
        color: "#818181",
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
    const [modalType, setModalType] = useState(null);
    const [totalIncome, setTotalIncome] = useState(null);
    const [totalExpense,  setTotalExpense] = useState(null);

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
                    }
                );
                const incomeEntries = {};
                let tmpIncomeSum = 0;
                incomeSourceEntries.forEach((entry) => {
                    tmpIncomeSum += parseFloat(entry.amount)
                    if (!incomeEntries[entry.type]) {
                        incomeEntries[entry.type] = [];
                    }
                    incomeEntries[entry.type].push(entry);
                });

                const expenseEntries = {};
                let tmpExpenseSum = 0;
                expenseSourceEntries.forEach((entry) => {
                    tmpExpenseSum += parseFloat(entry.amount)
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

                setTotalIncome(tmpIncomeSum);
                setTotalExpense(tmpExpenseSum);
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
            <Box
                sx={{
                    marginTop: "8%",
                }}
            >
                
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
                        Summary of Income of the Year : {currentYear}
                    </Typography>
                </Container>
                <Container>
                    <FormControl
                        sx={{
                            width: "15%",
                            height: "10%",
                            marginTop : "2%"
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select-year"
                            value={currentYear ? currentYear : ""}
                            label="Year Selection"
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
                {pieIncomeParams ? (
                    <Container 
                    // style={{ marginLeft: "10%" }}
                    >
                        <div 
                        style={{ display: "flex", flexDirection: "row" }}
                        >
                            <div 
                            style={{ flex: 1 }}
                            >
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
                            <div style={{ flex: 1, padding: 10, marginTop: "6%" }}>
                                <CustomChartLegend data={incomePieData} taxableIncome={taxableIncome} />
                            </div>
                        </div>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            Net Income for the Year: {currentYear} : {formatNumberWithCommas(totalIncome)} Baht
                        </Typography>
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
                            Data not found
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
                        Summary of Income of the Year : {currentYear}
                    </Typography>
                </Container>
                {pieExpenseParams ? (
                    <Container 
                    // style={{ marginLeft: "10%" }}
                    >
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
                            <div style={{ flex: 1, marginTop: "6%" }}>
                                <CustomChartLegend data={expensePieData} expenseType={expenseType} />
                            </div>
                        </div>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            Net Expense of the Year :{currentYear} : {formatNumberWithCommas(totalExpense)} Baht
                        </Typography>
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
                            Data not found
                        </Typography>
                    </Container>
                )}
                <PieChartInfoModal open={showPieChartModal} setOpen={setShowPieChartModal} modalParams={modalParams} modalType={modalType}></PieChartInfoModal>
            </Box>
    );
}
