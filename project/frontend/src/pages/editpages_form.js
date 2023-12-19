import React, { useState, useEffect } from "react";
import Navigate from "components/Navbar";
import EditMonthDataModal from "components/editMonthDataModal";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import "pages/editpages_form.css";
import mockData from "mockupData/mockData.json";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import DeleteIcon from '@mui/icons-material/Delete';
let data = mockData;

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedMonthData, setClickedMonthData] = useState(null);

  const handleEditClick = (monthData) => {
    setClickedMonthData(monthData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setClickedMonthData(null);
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.year}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Month</TableCell>
                </TableRow>
              </TableHead>
              {row.months.map((month) => (
                <TableRow key={month.date}>
                  <TableCell align="center">
                    <IconButton variant="outlined" onClick={() => handleEditClick(month)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">{month.date}</TableCell>
                </TableRow>
              ))}
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Pass clickedMonthData as a prop to EditMonthDataModal */}
      <EditMonthDataModal
        show={isModalOpen}
        onClose={handleCloseModal}
        clickedMonth={clickedMonthData}
      />
    </React.Fragment>
  );
}

function digestData(data) {
  const distinctYears = Array.from(new Set(data.map(entry => new Date(entry.date).getFullYear())));
  const distinctYearsArrayData = distinctYears.map(year => {
    return {
      year: year,
      months: data.filter(entry => new Date(entry.date).getFullYear() === year)
    };
  });
  return distinctYearsArrayData
}
Row.propTypes = {

};
export const EditFormPage = () => {
  const rows = digestData(data)
  return (
    <React.Fragment>
      <div className="header">
        <Navigate />
      </div>
      <div className="content">
      <Container fixed>
      
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.year} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Container>
      </div>

    </React.Fragment>
  );
};

export default EditFormPage;