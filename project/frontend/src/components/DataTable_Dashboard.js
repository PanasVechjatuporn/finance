import React, { useState, useEffect } from "react";
import Navigate from "components/Navbar";
import { useSelector } from "react-redux";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataTableRow } from "components/DataTableRow";
import mockData from "../mockupData/mockData";
import { Button } from "react-bootstrap";
const data = mockData;
async function fetchUserData(userStore) {
  // use axios to fetchUserData
  return data;
}

const groupDataByYear = (data) => {
  return data.reduce((acc, item) => {
      const year = item.date.split('-')[0];
      const existingYear = acc.find(entry => entry.year === year);
      if (existingYear) {
          existingYear.data.push(item);
      } else {
          acc.push({ year, data: [item] });
      }
      return acc;
  }, []);
};

export default function MonthDataTable() {
  const userStore = useSelector(state => state.userStore);
    const [userData, setUserData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [allYear, setAllYear] = useState(null);
    const [currentYearData, setCurrentYearData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserData(userStore);
                const groupedData = groupDataByYear(data)
                const yearInData = groupedData.map(data => data.year)
                if (yearInData.length > 0) {
                    setSelectedYear(yearInData[0]);
                    setCurrentYearData(groupedData.find(entry => entry.year === yearInData[0]));
                }
                setAllYear(yearInData)
                setUserData(groupedData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userStore]);

    useEffect(() => {
        if (userData && selectedYear) {
            setCurrentYearData(userData.find(entry => entry.year === selectedYear));
        }
    }, [selectedYear, userData]);

    if (!userData || !currentYearData) {
        return (<div>Loading...</div>);
    }
  return (
    <Container>
                <Box style={{ marginTop: "5%" }}>
                    <Paper style={{ position: "relative", paddingBottom: "70px" }}>
                        <TableContainer style={{ height: "70vh" }}>
                            <Table stickyHeader>
                                <TableHead sx={{
                                    "& th": {
                                        color: "white",
                                        backgroundColor: "orange"
                                    }
                                }} key={'table-header'}>
                                    <TableRow key={'table-row-header'}>
                                        <TableCell style={{ width: "1vh" }}></TableCell>
                                        <TableCell style={{ width: "1vh" }}></TableCell>
                                        <TableCell align="center" style={{ width: "10vh" }}>Month</TableCell>
                                        <TableCell align="center">Income</TableCell>
                                        <TableCell align="center">Investment</TableCell>
                                        <TableCell align="center">Expense</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentYearData.data.map((monthData, index) => (
                                        <DataTableRow key={`data-table-row-${index}`} dataMonth={monthData}></DataTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "orange", display: "flex", justifyContent: "flex-end" }}>
                            <Button style={{ marginRight: "12px" }}>New Month</Button>
                            <FormControl variant="standard" style={{ marginLeft: "10px", marginRight: "12px" }}>
                                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                                <Select
                                    labelId="year-selection"
                                    id="year-selection"
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                    }}
                                >
                                    {allYear.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select year to create or edit data</FormHelperText>
                            </FormControl>
                            <Button>Save</Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
  );
}