import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Box, Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import CustomChartLegend from "./CustomChartLegend_Dashboard";
const taxableIncome = [
    {
        name: "เงินได้ประเภทที่ 1",
        category: 1,
        label: "เงินเดือน",
        color: "#abadfd",
    },
    {
        name: "เงินได้ประเภทที่ 2",
        category: 2,
        label: "ค่าจ้างทั่วไป",
        color: "#abfca3",
    },
    {
        name: "เงินได้ประเภทที่ 3",
        category: 3,
        label: "ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา",
        color: "#f7f89a",
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
        color: "#fac991",
    },
    {
        name: "เงินได้ประเภทที่ 5",
        category: 5,
        label: "เงินได้จากการให้เช่าทรัพย์สิน",
        color: "#f688bf",
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
        color: "#52f5f5",
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
        color: "#ea7375",
    },
];

export default function PieChartComponent({ userData }) {
    const [highlighted] = useState("item");
    const [faded] = useState("series");
    const [currentYear, setCurrentYear] = useState(
        userData ? userData[0].year : null
    );
    const [pieExpenseInvestmentParams, setPieExpenseInvestmentParams] = useState(null);
    const [pieIncomeParams, setPieIncomeParams] = useState(null);
    const [incomePieData, setIncomePieData] = useState(null);
    useEffect(() => {
        if (userData && !currentYear) {
            setCurrentYear(userData[0].year)
        } else if (userData) {
            if (userData[0].data.length > 0) {
                const currentYearData = userData.filter(item => item.year === currentYear)[0].data;
                let yearlyIncome = 0;
                let incomePieData = [];
                let expensePieData = [];
                currentYearData.forEach(
                    ({ incomeData, expenseData, investmentData }) => {
                        //incomeData
                        incomeData.forEach((incomeSource) => {
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

                        //investmentData
                    }
                );
                setIncomePieData(incomePieData)
                setPieIncomeParams({
                    series: [
                        {
                            data: incomePieData,
                            highlighted: { additionalRadius: 10 },
                        },
                    ],
                    height: 400,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    margin: { top: 50, bottom: 50 },
                });
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
                <Typography>สรุปรายรับ ปี {currentYear}</Typography>
                {pieIncomeParams ? (
                    <>
                        <PieChart
                            colors={[
                                "#ea7375",
                                "#52f5f5",
                                "#f688bf",
                                "#fac991",
                                "#f7f89a",
                                "#abfca3",
                                "#abadfd",
                            ]}
                            {...pieIncomeParams}
                            series={pieIncomeParams.series.map((series) => ({
                                ...series,
                                highlightScope: {
                                    highlighted,
                                    faded,
                                },
                                cornerRadius: 5,
                            }))}
                            slotProps={{ legend: { hidden: true } }}
                            onClick={(data, index) => {
                                //test
                            }}
                        />
                        {/* <CustomChartLegend data={incomePieData}></CustomChartLegend> */}
                    </>
                ) : (
                    <>No Income Data</>
                )}
                <Typography>สรุปรายจ่าย/เงินลงทุน</Typography>
                {pieExpenseInvestmentParams ? (
                    <>
                        <PieChart
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
                        />
                        {/* <CustomChartLegend ></CustomChartLegend> */}
                    </>
                ) : (
                    <>No Expense and Investment Data</>
                )}
                <FormControl>
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
            </Box>
        </Container>
    );
}
