import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DataTableRow } from "components/DataTableRow";
import mockData from "../mockupData/mockData";
import EditMonthDataModal from "./editMonthDataModal";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
const data = mockData;
async function fetchUserData(userStore) {
  // use axios to fetchUserData
  return data;
}

const groupDataByYear = (data) => {
  return data.reduce((acc, item) => {
    const year = item.date.split("-")[0];
    const existingYear = acc.find((entry) => entry.year === year);
    if (existingYear) {
      existingYear.data.push(item);
    } else {
      acc.push({ year, data: [item] });
    }
    return acc;
  }, []);
};

export default function MonthDataTable() {
  const userStore = useSelector((state) => state.userStore);
  const [userData, setUserData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [allYear, setAllYear] = useState(null);
  const [currentYearData, setCurrentYearData] = useState(null);
  const [openNewMonthModal, setOpenNewMonthModal] = useState(false);

  const handleNewMonthClick = () => {
    openNewMonthModal
      ? setOpenNewMonthModal(false)
      : setOpenNewMonthModal(true);
  };

  const handleAddNewYear = async () => {
    const newYear = parseInt(allYear[allYear.length - 1]) + 1;
    setAllYear((prevYears) => [...prevYears, newYear]);
    await Promise.all([
      setSelectedYear(newYear.toString()),
      setUserData((prevUserData) => [
        ...prevUserData,
        { year: newYear.toString(), data: [] },
      ]),
    ]).then(() => {
      setCurrentYearData({ year: newYear.toString(), data: [] });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserData(userStore);
        const groupedData = groupDataByYear(data);
        const yearInData = groupedData.map((data) => data.year);
        if (yearInData.length > 0) {
          setSelectedYear(yearInData[0].toString());
          setCurrentYearData(
            groupedData.find((entry) => entry.year === yearInData[0])
          );
        }
        setAllYear(yearInData);
        setUserData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userStore]);

  useEffect(() => {
    if (userData && selectedYear) {
      setCurrentYearData(userData.find((entry) => entry.year === selectedYear));
    }
  }, [selectedYear, userData]);

  if (!userData || !currentYearData) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <Box style={{ marginTop: "5%" }}>
        <Paper style={{ position: "relative", paddingBottom: "70px" }}>
          <TableContainer style={{ height: "70vh" }}>
            <Table stickyHeader>
              <TableHead
                sx={{
                  "& th": {
                    color: "white",
                    backgroundColor: "orange",
                  },
                }}
                key={"table-header"}
              >
                <TableRow key={"table-row-header"}>
                  <TableCell style={{ width: "1vh" }}></TableCell>
                  <TableCell style={{ width: "1vh" }}></TableCell>
                  <TableCell align="center" style={{ width: "10vh" }}>
                    Month
                  </TableCell>
                  <TableCell align="center">Income</TableCell>
                  <TableCell align="center">Investment</TableCell>
                  <TableCell align="center">Expense</TableCell>
                </TableRow>
              </TableHead>
              <TableBodyDashboard
                currentYearData={currentYearData}
              ></TableBodyDashboard>
              {currentYearData.data.length !== 12 ? (
                <TableBody>
                  <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell
                      colSpan={6}
                      align="center"
                      onClick={(e) => {
                        handleNewMonthClick();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <IconButton
                        children={<AddCircleOutlineIcon></AddCircleOutlineIcon>}
                      ></IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <></>
              )}
            </Table>
          </TableContainer>
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "orange",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <FormControl
              variant="standard"
              style={{ marginLeft: "10px", marginRight: "12px" }}
            >
              <InputLabel id="year-selection-input-label">Year</InputLabel>
              <Select
                labelId="year-selection"
                id="year-selection"
                value={selectedYear}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedYear(e.target.value.toString());
                  }
                }}
              >
                {allYear.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
                <MenuItem
                  style={{ display: "flex", justifyContent: "center" }}
                  onClick={(e) => {
                    handleAddNewYear();
                  }}
                >
                  <AddCircleOutlineIcon></AddCircleOutlineIcon>
                </MenuItem>
              </Select>
              <FormHelperText>
                Select year to create or edit data
              </FormHelperText>
            </FormControl>
            {/* <Button>Save</Button> */}
          </Box>
        </Paper>
      </Box>
      <EditMonthDataModal
        show={openNewMonthModal}
        onClose={handleNewMonthClick}
        mode="newmonth"
        currentYearData={currentYearData}
        selectedYear={selectedYear}
      ></EditMonthDataModal>
    </Container>
  );
}

const TableBodyDashboard = ({ currentYearData }) => {
  return (
    <TableBody>
      {currentYearData.data.map((monthData, index) => (
        <DataTableRow
          key={`data-table-row-${index}`}
          dataMonth={monthData}
        ></DataTableRow>
      ))}
    </TableBody>
  );
};
