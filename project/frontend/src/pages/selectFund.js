import React from "react";
import { Link } from "react-router-dom";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, CardActionArea, CardActions, TextField } from '@mui/material';
import GoalCard from "components/GoalCard";
import mockGoal from "mockupData/mockGoal.json"
import { useLocation } from "react-router-dom";
import data from "mockupData/mockData.json";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import funds from 'mockupData/funds.json';


export const SelectFund = () => {

    const location = useLocation();
    const remainTax = location.state;

    let sumOfInvest = 0;
    data.map(item => {
        // Iterate over each income object within the item
        item.investment.map(investmentItem => {
            const { amount } = investmentItem;
            console.log(amount)
            sumOfInvest += parseInt(amount);
        });
    });

    const AvgInvest = sumOfInvest / 12;
    console.log(AvgInvest);

    const [investPercent, setInvestPercent] = React.useState('')
    const [investAmount, setInvestAmount] = React.useState('');

    React.useEffect(() => {
        const invest = Math.round((investPercent / 100) * AvgInvest);
        setInvestAmount(invest);
    }, [investPercent])

    const [fundName, setFundName] = React.useState('');

    const handleChange = (event) => {
        setFundName(event.target.value);
    };


    return (
        <React.Fragment>
            <Navigate />
            <Container style={{ display: 'flex', marginTop: 20, width: "70%", flexDirection: 'column' }}>
                <Typography>
                    ภาษีที่ต้องจ่าย : {remainTax} บาท
                </Typography>
                <Typography>
                    เงินลงทุนรายเดือน : {Math.round(AvgInvest)} บาท
                </Typography>
                <Typography>
                    ลงทุนในสัดส่วน :
                    <TextField inputProps={{ style: { textAlign: 'center', width: 50, fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={investPercent}
                        onChange={(e) => {
                            if (e.target.value.match(/^[1-9][0-9]{0,2}$/)) {
                                setInvestPercent(Math.min(100, parseInt(e.target.value)))
                            }
                            else if (!e.target.value) {
                                setInvestPercent('')
                            }
                        }} />
                    % คิดเป็นเงิน {investAmount} บาท
                </Typography>

                <div style={{ marginTop: 20 }}>
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                        <InputLabel id="select-autowidth-label">กองทุน</InputLabel>
                        <Select
                            labelId="select-autowidth-label"
                            id="select-autowidth"
                            value={fundName}
                            onChange={handleChange}
                            autoWidth
                            label="กองทุน"
                        >
                            <MenuItem value="None"><em>เลือกกองทุน</em></MenuItem>
                            {funds.map((item) => (
                                <MenuItem value={item.Name}>{item.Name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

            </Container>
        </React.Fragment >
    );
};
