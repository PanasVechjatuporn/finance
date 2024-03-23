import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const pieChartsParams = {
    series: [
        {
            data: [{ value: 5 }, { value: 10 }],
            label: "Series 1",
            highlighted: { additionalRadius: 10 },
        },
    ],
    height: 400,
    margin: { top: 50, bottom: 50 },
};

export default function PieChartComponent({ userData }) {
    const [highlighted] = useState("item");
    const [faded] = useState("series");
    const [currentYear, setCurrentYear] = useState(userData ? userData[0].year : null);
    const [pieExpenseInvestmentParams, setPieExpenseInvestmentParams] = useState(null);
    const [pieIncomeParams, setPieIncomeParams] = useState(null);
    useEffect(() => {
        if (userData && !currentYear) {
            setCurrentYear(userData[0].year)
        } else if (userData) {
            if (userData[0].data.length > 0) {
                const currentYearData = userData.filter(item => item.year === currentYear)[0].data;
                let yearlyIncome = 0;
                let incomePieData = []
                currentYearData.forEach(({ incomeData, expenseData, investmentData }) => {
                    incomeData.forEach((incomeSource) => {
                        const existingEntry = incomePieData.find(entry => entry.type === incomeSource.type);
                        if (existingEntry) {
                            existingEntry.value += parseFloat(incomeSource.amount);
                        } else {
                            incomePieData.push({
                                type: incomeSource.type,
                                value: parseFloat(incomeSource.amount)
                            });
                        }
                        yearlyIncome += parseFloat(incomeSource.amount);
                    })
                });
                setPieIncomeParams({
                    series: [
                        {
                            data: incomePieData,
                            label: "Series 1",
                            highlighted: { additionalRadius: 10 },
                        },
                    ],
                    height: 400,
                    margin: { top: 50, bottom: 50 },
                })
                console.log('incomePieData :: ', incomePieData)
                console.log('yearlyIncome :: ', yearlyIncome)
            }
        }
        // console.log('userData[2024] :: ',userData[0].data)
        // setPieChartsParams({
        //     series: [
        //         {
        //             data: [{ value: 5 }, { value: 10 }],
        //             label: "Series 1",
        //             highlighted: { additionalRadius: 10 },
        //         },
        //     ],
        //     height: 400,
        //     margin: { top: 50, bottom: 50 },
        // })
    }, [userData, currentYear])

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minWidth: "90vh",
                    minHeight: "90vh",
                    borderRadius: 6,
                    boxShadow: 6,
                    padding: 4,
                }}
            >
                <Stack
                    direction={{ xs: "column", xl: "row" }}
                    spacing={1}
                    sx={{ width: "100%" }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography>สรุปรายรับ</Typography>
                        {pieIncomeParams ? (<PieChart
                            {...pieIncomeParams}
                            series={pieIncomeParams.series.map((series) => ({
                                ...series,
                                highlightScope: {
                                    highlighted,
                                    faded,
                                },
                            }))}
                            onClick={(data, index) => {

                            }}
                        />) : <>No Income Data</>}

                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography>สรุปรายจ่าย/เงินลงทุน</Typography>
                        {pieExpenseInvestmentParams ? (<PieChart
                            {...pieExpenseInvestmentParams}
                            series={pieExpenseInvestmentParams.series.map((series) => ({
                                ...series,
                                highlightScope: {
                                    highlighted,
                                    faded,
                                },
                            }))}
                            onClick={(data, index) => {
                                //the pie knows their index but not data?
                            }}
                        />) : <>No Expense and Investment Data</>}
                    </Box>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label" >Select Year</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select-year"
                            value={currentYear ? currentYear : ""}
                            label="Select Year"
                            onChange={(e) => {
                                setCurrentYear(e.target.value)
                            }}
                        >
                            {
                                userData ? (
                                    userData.map((data, index) =>
                                        (<MenuItem value={data.year} key={index + data.year}>{data.year}</MenuItem>)
                                    )
                                ) : null
                            }
                        </Select>
                    </FormControl>
                </Stack>
            </Box>
        </Container>
    );
}
