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

export function NewTaxGoal() {

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const [personal, setPersonal] = React.useState('');
    const [personal1, setPersonal1] = React.useState('');
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
    const [charity1, setCharity1] = React.useState('');
    const [charity2, setCharity2] = React.useState('');
    const [charity3, setCharity3] = React.useState('');

    const [totalReduce, setTotalReduce] = React.useState('');

    React.useEffect(() => {
        const sumPersonal = Number(personal1 || 0) + Number(personal2 || 0) + Number(personal3 || 0) + Number(personal4 || 0) + Number(personal5 || 0) + Number(personal6 || 0);
        setPersonal(sumPersonal);
        const sumInsurance = Number(insurance1 || 0) + Number(insurance2 || 0) + Number(insurance3 || 0) + Number(insurance4 || 0) + Number(insurance5 || 0) + Number(insurance6 || 0) + Number(insurance7 || 0) + Number(insurance8 || 0);
        setInsurance(sumInsurance);
        const sumCharity = Number(charity1 || 0) + Number(charity2 || 0) + Number(charity3 || 0);
        setCharity(sumCharity);
        const sumAll = Number(personal || 0) + Number(insurance || 0) + Number(charity || 0);
        setTotalReduce(sumAll)
    }, [personal, insurance, charity, personal1, personal2, personal3, personal4, personal5, personal6, insurance1, insurance2, insurance3, insurance4, insurance5, insurance6, insurance7, insurance8, charity1, charity2, charity3]
    );



    return (
        <React.Fragment>
            <Navigate />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, }}>
                <TableContainer component={Paper} sx={{ width: '50%' }}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell align="center">จำนวนเงิน (บาท)</TableCell>
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
                                <TableCell align="left" style={{ width: "70%" }}>
                                    เงินได้พึงประเมิน
                                </TableCell>
                                <TableCell style={{ width: "20%" }} align="center">50000</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <Table>
                                            <TableRow>
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ width: "70%" }}>
                                                    ประเภทที่ 1
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    25000
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ width: "70%" }}>
                                                    ประเภทที่ 2
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    25000
                                                </TableCell>
                                            </TableRow>
                                        </Table>
                                    </Collapse>
                                </TableCell>
                            </TableRow>

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
                                <TableCell align="left" style={{ width: "70%" }}>
                                    หักค่าใช้จ่าย
                                </TableCell>
                                <TableCell style={{ width: "20%" }} align="center">6000</TableCell>
                            </TableRow>
                            <TableRow  >
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                    <Collapse in={open1} timeout="auto" unmountOnExit>
                                        <Table>
                                            <TableRow>
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ width: "70%" }}>
                                                    หักค่าใช้จ่าย ประเภทที่ 1
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    2500
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ width: "70%" }}>
                                                    หักค่าใช้จ่าย ประเภทที่ 2
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    3500
                                                </TableCell>
                                            </TableRow>
                                        </Table>
                                    </Collapse>
                                </TableCell>
                            </TableRow>

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
                                <TableCell align="left" style={{ width: "70%" }}>
                                    ค่าลดหย่อน
                                </TableCell>
                                <TableCell style={{ width: "20%" }} align="center">
                                    {totalReduce}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                    <Collapse in={open2} timeout="auto" unmountOnExit>
                                        <Table>

                                            {/*ค่าลดหย่อน1*/}
                                            <TableRow >
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                    ค่าลดหย่อนภาษีส่วนตัวและครอบครัว
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    {personal}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                    <Table>
                                                        <TableRow>
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                ค่าลดหย่อนส่วนตัว
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal1} onChange={(input) => { setPersonal1(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                ค่าลดหย่อนคู่สมรส
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal2} onChange={(input) => { setPersonal2(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                ค่าลดหย่อนฝากครรภ์ และคลอดบุตร
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal3} onChange={(input) => { setPersonal3(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                ค่าลดหย่อนภาษีบุตร
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal4} onChange={(input) => { setPersonal4(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                ค่าลดหย่อนสำหรับเลี้ยงดูบิดามารดาของตนเองและของคู่สมรส
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal5} onChange={(input) => { setPersonal5(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                ค่าลดหย่อนภาษีกรณีอุปการะผู้พิการ หรือบุคคลทุพพลภาพ
                                                            </TableCell>
                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={personal6} onChange={(input) => { setPersonal6(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                    </Table>
                                                </TableCell>
                                            </TableRow>

                                            {/*ค่าลดหย่อน2*/}
                                            <TableRow >
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                    ค่าลดหย่อนภาษีกลุ่มประกัน กองทุน และการลงทุน
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    {insurance}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                    <Table>
                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เงินประกันสังคม
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance1} onChange={(input) => { setInsurance1(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เบี้ยประกันชีวิต และประกันแบบสะสมทรัพย์ที่มีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance2} onChange={(input) => { setInsurance2(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เบี้ยประกันสุขภาพ และเบี้ยประกันอุบัติเหตุที่คุ้มครองสุขภาพ
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance3} onChange={(input) => { setInsurance3(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เบี้ยประกันสุขภาพของบิดามารดา
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance4} onChange={(input) => { setInsurance4(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เบี้ยประกันชีวิตแบบบำนาญที่มีมีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance5} onChange={(input) => { setInsurance5(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                กองทุนสำรองเลี้ยงชีพ กองทุนบำเหน็จบำนาญราชการ กองทุนสงเคราะห์ครูโรงเรียนเอกชน
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance6} onChange={(input) => { setInsurance6(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                กองทุนการออมแห่งชาติ (กอช.)
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance7} onChange={(input) => { setInsurance7(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เงินลงทุนธุรกิจ Social Enterprise (วิสาหกิจเพื่อสังคม)
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={insurance8} onChange={(input) => { setInsurance8(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>

                                            {/*ค่าลดหย่อน3*/}
                                            <TableRow >
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                    ค่าลดหย่อนภาษีกลุ่มเงินบริจาค
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    {charity}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                    <Table>
                                                        <TableRow>
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เงินบริจาคทั่วไป
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={charity1} onChange={(input) => { setCharity1(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เงินบริจาคเพื่อการศึกษา การกีฬา การพัฒนาสังคม เพื่อประโยชน์สาธารณะ และบริจาคเพื่อสถานพยาบาลของรัฐ
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={charity2} onChange={(input) => { setCharity2(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                เงินบริจาคให้กับพรรคการเมือง
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='0' id="standard-basic" label="" variant="standard" value={charity3} onChange={(input) => { setCharity3(input.target.value) }} />
                                                            </TableCell>
                                                        </TableRow>

                                                    </Table>
                                                </TableCell>
                                            </TableRow>

                                            {/*ค่าลดหย่อน4*/}
                                            <TableRow >
                                                <TableCell style={{ width: "10%" }} />

                                                <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                    ค่าลดหย่อนภาษีในการซื้อกองทุนรวม
                                                </TableCell>

                                                <TableCell align="center" style={{ width: "20%" }} >
                                                    -
                                                </TableCell>
                                            </TableRow>
                                            <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                    <Table>
                                                        <TableRow>
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                กองทุนรวมเพื่อการเลี้ยงชีพ (RMF)
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                -
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow >
                                                            <TableCell style={{ width: "10%" }} />

                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                กองทุนรวมเพื่อการออม (SSF)
                                                            </TableCell>

                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                -
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>

                                        </Table>
                                    </Collapse>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </React.Fragment>
    );
}
