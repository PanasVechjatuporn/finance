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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DataTableRow } from "components/DataTableRow_Dashboard";
import EditMonthDataModal from "./EditMonthDataModal_Dashboard";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OverlayLoading from "./OverlayLoading";
import axios from "axios";
import { Typography } from "@mui/material";

const baseURL = "http://localhost:8000";

function fetchUserData(userStore) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/db/userdata_dashboard`, {
        headers: {
          Authorization: userStore.userToken,
          userId: userStore.userId,
        },
      })
      .then((response) => {
        let data = [];
        response.data.queryResult.forEach((e) => {
          data.push(e);
        });
        resolve(data);
      })
      .catch((error) => {
        console.log("err :: ", error);
        reject(error);
      });
  });
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

export default function MonthDataTable({ userData, setUserData }) {
  const userStore = useSelector((state) => state.userStore);
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
    Promise.all([fetchUserData(userStore)]).then((res) => {
      const data = res[0];
      if (data.length > 0) {
        const groupedData = groupDataByYear(data);
        const yearInData = groupedData.map((data) => data.year);
        if (yearInData.length > 0) {
          setSelectedYear(yearInData[0].toString());
          let dataYear = groupedData.find(
            (entry) => entry.year === yearInData[0]
          );
          let tmpMonthArray = dataYear.data;
          tmpMonthArray.sort((a, b) => {
            if (a.date < b.date) {
              return -1;
            }
            if (a.date > b.date) {
              return 1;
            }
            return 0;
          });
          dataYear.data = tmpMonthArray;
          setCurrentYearData(dataYear);
        }
        setAllYear(yearInData);
      } else {
        const currentDate = new Date();
        const currentYearObj = {
          data: [],
          year: currentDate.getFullYear().toString(),
        };
        setSelectedYear(currentDate.getFullYear().toString());
        setCurrentYearData(currentYearObj);
        setAllYear([currentDate.getFullYear().toString()]);
      }
    });
  }, [userStore]);

  useEffect(() => {
    if (userData && selectedYear) {
      let dataYear = userData.find((entry) => entry.year === selectedYear);
      let tmpMonthArray = dataYear.data;
      tmpMonthArray.sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
      dataYear.data = tmpMonthArray;
      setCurrentYearData(dataYear);
    }
  }, [selectedYear, userData]);

  if (!userData || !currentYearData) {
    return <OverlayLoading isLoading={true} />;
  }

  return (
    <Container>
      <Box>
        <Typography
          variant="h5"
          style={{
            color: "#757575",
            textDecoration: "underline",
            textDecorationColor: "transparent",
            borderBottom: "2px solid #757575",
            display: "inline-block",
            width: "100%",
            paddingBottom: "8px",
            userSelect: "none",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
          sx={{
            padding: 1,
          }}
        >
          เพิ่มหรือแก้ไขข้อมูล รายรับ/รายจ่าย/การลงทุน
        </Typography>
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
                  เดือน
                </TableCell>
                <TableCell align="center">รายรับ</TableCell>
                <TableCell align="center">รายจ่าย</TableCell>
                {/* <TableCell align="center">เงินลงทุน</TableCell> */}
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            {currentYearData.data.length > 0 ? (
              <TableBody>
                {currentYearData.data.map((monthData, index) => (
                  <DataTableRow
                    key={`data-table-row-${index}-${selectedYear}`}
                    dataMonth={monthData}
                    currentYearData={currentYearData}
                    userData={userData}
                    setUserData={setUserData}
                    selectedYear={selectedYear}
                    isDeleteActive={
                      parseInt(currentYearData.data.length) ===
                        parseInt(index + 1) && currentYearData.data.length !== 1
                        ? true
                        : false
                    }
                  ></DataTableRow>
                ))}
              </TableBody>
            ) : (
              <></>
            )}
            {currentYearData.data.length !== 12 ? (
              <TableBody>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell
                    colSpan={7}
                    align="center"
                    onClick={(e) => {
                      handleNewMonthClick();
                    }}
                    style={{ cursor: "pointer" }}
                    key={"add-new-month-data"}
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
            backgroundColor: "orange",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <FormControl
            variant="standard"
            style={{ marginLeft: "10px", marginRight: "30px" }}
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
                <MenuItem
                  key={index + "-menuitem-" + item + selectedYear}
                  value={item}
                >
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
            <FormHelperText>Select year to create or edit data</FormHelperText>
          </FormControl>
        </Box>
      </Box>
      <EditMonthDataModal
        show={openNewMonthModal}
        onClose={handleNewMonthClick}
        mode="newmonth"
        currentYearData={currentYearData}
        selectedYear={selectedYear}
        setCurrentYearData={setCurrentYearData}
        userData={userData}
        setUserData={setUserData}
      ></EditMonthDataModal>
    </Container>
  );
}
