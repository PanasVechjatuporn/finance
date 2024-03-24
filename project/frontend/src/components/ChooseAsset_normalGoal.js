import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navigate from "components/Navbar";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

import "./ChooseAsset_normalGoal.css";

export const ChooseAsset = ({ sendData, data }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");

  function logData() {
    console.log(JSON.stringify(data));
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    console.log(selectedValue); // This will log the updated value whenever `selectedValue` changes.
  }, [selectedValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedValue(selectedValue);
    // console.log(selectedValue);
    const combinedData = {
      data,
      selectedValue,
    };
    console.log(combinedData);
    sendData(combinedData);
  };

  return (
    <React.Fragment>
      <div className="FormResult">
        <div className="Risk">{data.risk_profile}</div>
        <div className="TextFieldForm">{data.alphabetFields}</div>
        <div className="TextFieldForm">{data.year}</div>
        <div className="TextFieldForm">{data.amount}</div>
        <div className="TextFieldForm">{data.age}</div>
        <div className="TextFieldForm">{data.percentage}</div>
      </div>

      <div className="AssetChoice">
        <FormControl>
          <FormLabel id="asset-choice">เลือกลงทุนใน</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="options"
            value={selectedValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="deposit"
              control={<Radio />}
              label="เงินฝากประจำ"
            />
            <FormControlLabel
              value="fund"
              control={<Radio />}
              label="กองทุนรวมที่ไม่มีสิทธิประโยชน์ทางภาษี"
            />
            <FormControlLabel
              value="rmf"
              control={<Radio />}
              label="กองทุน RMF"
            />
            <FormControlLabel
              value="ssf"
              control={<Radio />}
              label="กองทุน SSF"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <Button onClick={logData}>reload</Button>
      <Button onClick={handleSubmit}>Next</Button>
    </React.Fragment>
  );
};
