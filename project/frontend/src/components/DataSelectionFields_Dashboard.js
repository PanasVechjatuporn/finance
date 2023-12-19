import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
export const SelectionFields = ({
  data,
  startDate,
  endDate,
  onUpdateStartDate,
  onUpdateEndDate,
}) => {
  const dateObjects = data.map((item) => new Date(item.date));

  let selectOption = [];
  dateObjects.forEach((element) => {
    const date = new Date(element);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}`;

    selectOption.push(String(formattedDate));
  });

  const [sumAmount, setSumAmount] = useState(0);

  useEffect(() => {
    handleDateChange(startDate, endDate);
  });

  const handleDateChange = () => {
    const [startYear, startMonth] = startDate.split("-").map(Number);
    const [endYear, endMonth] = endDate.split("-").map(Number);
    const dataArray = data
      .filter((item) => {
        const [itemYear, itemMonth] = item.date.split("-").map(Number);
        return (
          (itemYear > startYear ||
            (itemYear === startYear && itemMonth >= startMonth)) &&
          (itemYear < endYear ||
            (itemYear === endYear && itemMonth <= endMonth))
        );
      })

    let sum_income = 0;
    dataArray.forEach(record => {
      const income_list = record.income;

      sum_income += parseInt(income_list.reduce((sum, income) => sum + parseInt(income.amount), 0));
    });

    const calculatedSum = sum_income;

    setSumAmount(calculatedSum);
    onUpdateStartDate(startDate);
    onUpdateEndDate(endDate);
  };

  const handleStartDateChange = (selectedDate) => {
    onUpdateStartDate(selectedDate);
  };

  const handleEndDateChange = (selectedDate) => {
    onUpdateEndDate(selectedDate);
  };

  return (


    <React.Fragment>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">From</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            onChange={(e) => handleStartDateChange(e.target.value)}
            label="From"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {selectOption.map((date) => (

              <MenuItem value={date} disabled={date >= endDate}> {date}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">To</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            onChange={(e) => handleEndDateChange(e.target.value)}
            label="To"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {selectOption.map((date) => (
              <MenuItem value={date} disabled={date <= startDate}> {date}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl halfWidth sx={{ m: 1, minWidth: 140 }}>
          <TextField
            startAdornment={<InputAdornment position="End">฿</InputAdornment>}
            label="Amount of Income"
            InputProps={{ readOnly: true }}
            value={startDate !== "" && endDate !== "" ? sumAmount : ""}
          />
        </FormControl>
      </Box>
    </React.Fragment>
  );
};

export default SelectionFields;
