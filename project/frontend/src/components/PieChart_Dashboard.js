import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Box, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Pie } from "react-chartjs-2";
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
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
const Data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234
    }
  ];
export default function PieChartComponent({ userData }) {
    const [highlighted] = useState("item");
    const [faded] = useState("series");
    const [currentYear, setCurrentYear] = useState(
        userData ? userData[0].year : null
    );
    const [pieExpenseInvestmentParams, setPieExpenseInvestmentParams] =
        useState(null);
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
                            if (existingEntry) {
                                existingEntry.value += parseFloat(incomeSource.amount);
                            } else {
                                incomePieData.push({
                                    type: incomeSource.type,
                                    value: parseFloat(incomeSource.amount),
                                    label: incomeTypeLabel,
                                });
                            }
                            yearlyIncome += parseFloat(incomeSource.amount);
                        });
                        console.log('incomePieData :: ',incomePieData)
                        //expenseData
                        expenseData.forEach((expenseSource) => {
                            const existingEntry = expensePieData.find(
                                (entry) => entry.type === expenseData.type
                            );
                            if (existingEntry) {
                                existingEntry.value += parseFloat(expenseSource.amount);
                            } else {
                                expensePieData.push({});
                            }
                        });
                        //investmentData
                    }
                );
                // {
                //     labels: Data.map((data) => data.year), 
                //     datasets: [
                //       {
                //         label: "Users Gained ",
                //         data: Data.map((data) => data.userGain),
                //         backgroundColor: [
                //           "rgba(75,192,192,1)",
                //           &quot;#ecf0f1",
                //           "#50AF95",
                //           "#f3ba2f",
                //           "#2a71d0"
                //         ],
                //         borderColor: "black",
                //         borderWidth: 2
                //       }
                //     ]
                //   }
                setPieIncomeParams({
                    labels: Data.map((data) => data.year), 
                    datasets: [
                      {
                        label: "Users Gained ",
                        data: Data.map((data) => data.userGain),
                        backgroundColor: [
                          "rgba(75,192,192,1)",
                          "#50AF95",
                          "#f3ba2f",
                          "#2a71d0"
                        ],
                        borderColor: "black",
                        borderWidth: 2
                      }
                    ]
                  })
                // setPieIncomeParams({
                //     series: [
                //         {
                //             data: incomePieData,
                //             highlighted: { additionalRadius: 10 },
                //         },
                //     ],
                //     height: 400,
                //     paddingAngle: 5,
                //     cornerRadius: 5,
                //     margin: { top: 50, bottom: 50 },
                // });
            }
        }
    }, [userData, currentYear]);

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
                    <div className="chart-container">
                        <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
                        <Pie
                            data={pieIncomeParams}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Users Gained between 2016-2020"
                                    }
                                }
                            }}
                        />
                    </div>
                ) : (
                    <>No Income Data</>
                )}
                <Typography>สรุปรายจ่าย/เงินลงทุน</Typography>
                {pieExpenseInvestmentParams ? (
                    <div>

                    </div>
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
