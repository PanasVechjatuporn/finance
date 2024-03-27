import React from 'react';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import axios from 'axios';


export default function UserFundTable({ setFund, open }) {
    const uid = useSelector(state => state.userStore.userId);
    const [arr, setArr] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            let sumFund = 0;
            axios.get(`http://localhost:8000/db/userassets=${uid}`)
                .then(response => { setArr(response.data); });
            await Promise.all(arr.map((asset) => (
                Object.values(asset.Funds).map((eachFund) => {
                    sumFund += Number(eachFund.amount);
                })))
            )
            setFund(sumFund);
        }
        fetchData();
    }, [arr])


    return (
        Object.entries(arr).map(([objKey, eachAsset], index) => (
            Object.values(eachAsset.Funds).map((fund) => {
                return <TableRow sx={{ '& > *': { borderBottom: 'none' } }} key={index} >
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table>
                                <TableBody>
                                    <TableRow >
                                        <TableCell style={{ width: "10%" }} />
                                        <TableCell align="left" style={{ width: "70%" }}>
                                            {fund.fundName}
                                        </TableCell>
                                        <TableCell align="center" style={{ width: "20%" }}>
                                            {parseInt(fund.amount).toLocaleString('en-GB')}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            })

        ))
    )
}
