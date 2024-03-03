import React from 'react';
import PropTypes from 'prop-types';
import { Container } from "react-bootstrap";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Navigate from "components/Navbar";
import TextField from '@mui/material/TextField';
import data from "mockupData/mockData.json";
import IncomeTable from 'components/IncomeTable';
import ExpenseBenefitTable from 'components/ExpenseBenefitTable';
import StartIcon from '@mui/icons-material/Start';
import { Link } from 'react-router-dom';

export function NewTaxGoal() {

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [open4, setOpen4] = React.useState(false);
    const [open5, setOpen5] = React.useState(false);

    const [personal, setPersonal] = React.useState('');
    const [personal1, setPersonal1] = React.useState('60000');
    const [personal2, setPersonal2] = React.useState('');
    const [personal3, setPersonal3] = React.useState('');
    const [personal4, setPersonal4] = React.useState('');
    const [personal5, setPersonal5] = React.useState('');
    const [personal6, setPersonal6] = React.useState('');

    const [insurance, setInsurance] = React.useState('');
    const [insurance1, setInsurance1] = React.useState('');
    const [insurance2, setInsurance2] = React.useState('');
    const [insurance3, setInsurance3] = React.useState('');
    const [insurance4, setInsurance4] = React.useState('');
    const [insurance5, setInsurance5] = React.useState('');
    const [insurance6, setInsurance6] = React.useState('');
    const [insurance7, setInsurance7] = React.useState('');
    const [insurance8, setInsurance8] = React.useState('');

    const [charity, setCharity] = React.useState('');
    const [charities, setCharities] = React.useState([
        { name: 'เงินบริจาคทั่วไป', value: '' },
        { name: 'เงินบริจาคเพื่อการศึกษา การกีฬา การพัฒนาสังคม เพื่อประโยชน์สาธารณะ และบริจาคเพื่อสถานพยาบาลของรัฐ', value: '' },
        { name: 'เงินบริจาคให้กับพรรคการเมือง', value: '' }
    ]);

    const handleCharityChange = (index, value) => {
        const updatedCharities = [...charities];
        if (index == 2) {
            updatedCharities[index].value = Math.min(10000, parseInt(value));
            setCharities(updatedCharities)
        } else {
            updatedCharities[index].value = value;
            setCharities(updatedCharities);
        }
    };

    const [totalReduce, setTotalReduce] = React.useState('');

    React.useEffect(() => {
        makeIncomeArr();
        const sumPersonal = Number(personal1 || 0) + Number(personal2 || 0) + Number(personal3 || 0) + Number(personal4 || 0) + Number(personal5 || 0) + Number(personal6 || 0);
        setPersonal(sumPersonal);
        const sumInsurance = Number(insurance1 || 0) + Number(insurance2 || 0) + Number(insurance3 || 0) + Number(insurance4 || 0) + Number(insurance5 || 0) + Number(insurance6 || 0) + Number(insurance7 || 0) + Number(insurance8 || 0);
        setInsurance(sumInsurance);
        const sumCharity = charities.reduce((acc, charity) => acc + Number(charity.value || 0), 0);
        setCharity(sumCharity);
        const sumAll = Number(personal || 0) + Number(insurance || 0) + Number(charity || 0);
        setTotalReduce(sumAll)
    }, [personal, insurance, charity, personal1, personal2, personal3, personal4, personal5, personal6, insurance1, insurance2, insurance3, insurance4, insurance5, insurance6, insurance7, insurance8, charities]
    );

    // Helper function to create a deep copy of an object
    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    const [benefitObj, setBenefitObj] = React.useState(0);
    const [incomeObj, setIncomeObj] = React.useState(0);
    const [incomeSum, setIncomeSum] = React.useState(0);
    const [benefitSum, setBenefitSum] = React.useState(0);


    async function makeIncomeArr() {

        const sumByType = {};
        let sumOfIncome = 0;
        let sumOfBenefit = 0;

        // Iterate over each object in the array
        await Promise.all(data.map(item => {
            // Iterate over each income object within the item
            item.income.map(incomeItem => {
                const { type, sub_type, amount } = incomeItem;

                // Increment sumOfIncome
                sumOfIncome += parseInt(amount);

                if (sub_type) {

                    // Initialize nested object for type if not present
                    if (!sumByType[type]) {
                        sumByType[type] = {};
                    }

                    // Initialize nested object for sub_type if not present
                    if (!sumByType[type][sub_type]) {
                        sumByType[type][sub_type] = 0;
                    }

                    // Convert amount to number and add it to the sum corresponding to its type and sub_type
                    sumByType[type][sub_type] += parseInt(amount);
                }
                else {
                    // Initialize nested object for type if not present
                    if (!sumByType[type]) {
                        sumByType[type] = {};
                    }

                    // Initialize nested object for sub_type if not present
                    if (!sumByType[type][0]) {
                        sumByType[type][0] = 0;
                    }

                    // Convert amount to number and add it to the sum corresponding to its type and sub_type
                    sumByType[type][0] += parseInt(amount);
                }
            });
        }));

        // Create ExpenseBenefit based on sumByType
        const ExpenseBenefit = deepCopy(sumByType);

        // Access and modify properties of ExpenseBenefit only if they exist
        if (sumByType[1] || sumByType[2]) {
            if (sumByType[1][0] && !sumByType[2][0]) {
                ExpenseBenefit[2][0] = Math.min(100000, ExpenseBenefit[2][0] = ExpenseBenefit[1][0] * 0.5);
                sumOfBenefit += ExpenseBenefit[1][0];
            }
            if (sumByType[2][0] && !sumByType[1][0]) {
                ExpenseBenefit[2][0] = Math.min(100000, ExpenseBenefit[2][0] = ExpenseBenefit[2][0] * 0.5);
                sumOfBenefit += ExpenseBenefit[2][0];
            }
            if (sumByType[1][0] && sumByType[2][0]) {
                ExpenseBenefit[0] = {};
                ExpenseBenefit[0][0] = Math.min(100000, (ExpenseBenefit[1][0] + ExpenseBenefit[2][0]) * 0.5);
                sumOfBenefit += ExpenseBenefit[0][0];
                delete ExpenseBenefit[1]
                delete ExpenseBenefit[2]
            }
        }
        if (sumByType[3]) {
            if (sumByType[3][0]) {
                ExpenseBenefit[3][0] *= 0.5;
                ExpenseBenefit[3][0] = Math.min(100000, ExpenseBenefit[3][0]);
                sumOfBenefit += ExpenseBenefit[3][0];
            }
        }
        if (sumByType[5]) {
            if (sumByType[5][1]) {
                ExpenseBenefit[5][1] *= 0.3;
                sumOfBenefit += ExpenseBenefit[5][1];
            }
            if (sumByType[5][2]) {
                ExpenseBenefit[5][2] *= 0.2;
                sumOfBenefit += ExpenseBenefit[5][2];
            }
            if (sumByType[5][3]) {
                ExpenseBenefit[5][3] *= 0.15;
                sumOfBenefit += ExpenseBenefit[5][3];
            }
            if (sumByType[5][4]) {
                ExpenseBenefit[5][4] *= 0.3;
                sumOfBenefit += ExpenseBenefit[5][4];
            }
            if (sumByType[5][5]) {
                ExpenseBenefit[5][5] *= 0.1;
                sumOfBenefit += ExpenseBenefit[5][5];
            }
            if (sumByType[5][6]) {
                ExpenseBenefit[5][6] *= 0.2;
                sumOfBenefit += ExpenseBenefit[5][6];
            }
        }
        if (sumByType[6]) {
            if (sumByType[6][1]) {
                ExpenseBenefit[6][1] *= 0.6;
                sumOfBenefit += ExpenseBenefit[6][1];
            }
            if (sumByType[6][2]) {
                ExpenseBenefit[6][2] *= 0.3;
                sumOfBenefit += ExpenseBenefit[6][2];
            }
        }
        if (sumByType[7]) {
            if (sumByType[7][0]) {
                ExpenseBenefit[7][0] *= 0.3;
                sumOfBenefit += ExpenseBenefit[7][0];
            }
        }
        setBenefitObj(ExpenseBenefit);
        setIncomeObj(sumByType);
        setIncomeSum(sumOfIncome);
        setBenefitSum(sumOfBenefit);
    }

    console.log(benefitObj);
    console.log(incomeObj);

    return (
        <React.Fragment>
            <Navigate />
            <div style={{ display: 'flex', marginTop: 20, flexDirection: 'column', alignItems: 'center' }}>
                <TableContainer component={Paper} sx={{ width: '50%' }}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell align="center" style={{ fontWeight: "bold" }}>จำนวนเงิน (บาท)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {/*เงินได้พึงประเมิน*/}
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, width: '100%' }}>
                                <TableCell style={{ width: '10%' }}>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                    เงินได้พึงประเมิน
                                </TableCell>
                                <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">{incomeSum}</TableCell>
                            </TableRow>
                            <IncomeTable obj={incomeObj} open={open} />

                            {/*ค่าใช้จ่าย*/}
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, width: '100%' }}>
                                <TableCell style={{ width: '10%' }}>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen1(!open1)}
                                    >
                                        {open1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                    หักค่าใช้จ่าย
                                </TableCell>
                                <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">{benefitSum}</TableCell>
                            </TableRow>
                            <ExpenseBenefitTable obj={benefitObj} open={open1} />

                            {/*ค่าลดหย่อน*/}
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, width: '100%' }}>
                                <TableCell style={{ width: '10%' }}>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen2(!open2)}
                                    >
                                        {open2 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                    ค่าลดหย่อน
                                </TableCell>
                                <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">
                                    {totalReduce}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                    <Collapse in={open2} timeout="auto" unmountOnExit>

                                        <Table>
                                            <TableBody>
                                                {/*ค่าลดหย่อน1*/}
                                                <TableRow >
                                                    <TableCell style={{ width: "10%" }} >
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => setOpen3(!open3)}
                                                        >
                                                            {open3 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>

                                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                        ค่าลดหย่อนภาษีส่วนตัวและครอบครัว
                                                    </TableCell>

                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                        {personal}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                        <Collapse in={open3} timeout="auto" unmountOnExit>
                                                            <Table>
                                                                <TableRow>
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        ค่าลดหย่อนส่วนตัว
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal1}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setPersonal1(Math.min(60000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setPersonal1('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        ค่าลดหย่อนคู่สมรส
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal2}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setPersonal2(Math.min(60000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setPersonal2('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        ค่าลดหย่อนฝากครรภ์ และคลอดบุตร
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal3}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setPersonal3(Math.min(60000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setPersonal3('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        ค่าลดหย่อนภาษีบุตร
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal4}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setPersonal4(e.target.value)
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setPersonal4('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        ค่าลดหย่อนสำหรับเลี้ยงดูบิดามารดาของตนเองและของคู่สมรส
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal5}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setPersonal5(Math.min(120000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setPersonal5('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        ค่าลดหย่อนภาษีกรณีอุปการะผู้พิการ หรือบุคคลทุพพลภาพ
                                                                    </TableCell>
                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal6}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setPersonal6(e.target.value)
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setPersonal6('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                            </Table>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>

                                                {/*ค่าลดหย่อน2*/}
                                                <TableRow >
                                                    <TableCell style={{ width: "10%" }} >
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => setOpen4(!open4)}
                                                        >
                                                            {open4 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>

                                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                        ค่าลดหย่อนภาษีกลุ่มประกัน กองทุน และการลงทุน
                                                    </TableCell>

                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                        {insurance}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                        <Collapse in={open4} timeout="auto" unmountOnExit>
                                                            <Table>
                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        เงินประกันสังคม
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance1}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance1(Math.min(9000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance1('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        เบี้ยประกันชีวิต และประกันแบบสะสมทรัพย์ที่มีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance2}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance2(Math.min(100000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance2('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        เบี้ยประกันสุขภาพ และเบี้ยประกันอุบัติเหตุที่คุ้มครองสุขภาพ
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance3}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance3(Math.min(25000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance3('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        เบี้ยประกันสุขภาพของบิดามารดา
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance4}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance4(Math.min(15000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance4('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        เบี้ยประกันชีวิตแบบบำนาญที่มีมีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance5}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance5(Math.min(200000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance5('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        กองทุนสำรองเลี้ยงชีพ กองทุนบำเหน็จบำนาญราชการ กองทุนสงเคราะห์ครูโรงเรียนเอกชน
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance6}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance6(Math.min(500000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance6('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        กองทุนการออมแห่งชาติ (กอช.)
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance7}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance7(Math.min(13200, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance7('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow >
                                                                    <TableCell style={{ width: "10%" }} />

                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                        เงินลงทุนธุรกิจ Social Enterprise (วิสาหกิจเพื่อสังคม)
                                                                    </TableCell>

                                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                                        <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance8}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                    setInsurance8(Math.min(100000, parseInt(e.target.value)))
                                                                                }
                                                                                else if (!e.target.value) {
                                                                                    setInsurance8('')
                                                                                }
                                                                            }} />
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>

                                                {/*ค่าลดหย่อน3*/}
                                                <TableRow >
                                                    <TableCell style={{ width: "10%" }} >
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => setOpen5(!open5)}
                                                        >
                                                            {open5 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>

                                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                        ค่าลดหย่อนภาษีกลุ่มเงินบริจาค
                                                    </TableCell>

                                                    <TableCell align="center" style={{ width: "20%" }} >
                                                        {charity}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                        <Collapse in={open5} timeout="auto" unmountOnExit>
                                                            <Table>
                                                                <TableBody>
                                                                    {
                                                                        charities.map((charity, index) => {
                                                                            return (
                                                                                <TableRow key={index}>
                                                                                    <TableCell align="left" style={{ width: "70%" }}>
                                                                                        {charity.name}
                                                                                    </TableCell>
                                                                                    <TableCell align="center" style={{ width: "20%" }}>
                                                                                        <TextField
                                                                                            inputProps={{ style: { textAlign: 'center', fontSize: 14 } }}
                                                                                            placeholder='0'
                                                                                            id="standard-basic"
                                                                                            label=""
                                                                                            variant="standard"
                                                                                            value={charity.value}
                                                                                            onChange={(e) => {
                                                                                                if (e.target.value.match(/^[1-9][0-9]{0,5}$/)) {
                                                                                                    handleCharityChange(index, e.target.value)
                                                                                                }
                                                                                                else if (!e.target.value) {
                                                                                                    handleCharityChange(index, '')
                                                                                                }
                                                                                            }} />
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        })
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    </Collapse>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>

                <Container style={{ display: 'flex', width: '50%', marginTop: 20, justifyContent: 'space-between' }}>
                    <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                        ภาษีที่ต้องจ่าย
                    </Typography>
                    <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                        {incomeSum - benefitSum - personal - insurance - charity} บาท
                    </Typography>
                </Container>

                <Container style={{ display: 'flex', width: '50%', marginTop: 5, marginBottom: 15, justifyContent: 'right', alignItems: 'center' }}>
                    <Link
                        state={incomeSum - benefitSum - personal - insurance - charity}
                        to={"./select-fund"}
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <IconButton
                            aria-label="next page"
                            size="small"
                        >
                            <StartIcon color='action' />
                        </IconButton>
                    </Link>
                </Container>
            </div>
        </React.Fragment >
    );
}
