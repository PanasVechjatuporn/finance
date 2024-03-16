import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navigate from "components/Navbar";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import "./ChooseAsset_normalGoal.css";

export const ChooseAsset = ({ data }) => {
  const navigate = useNavigate();

  function logData() {
    console.log(data);
    console.log(data.alpha);
  }

  function handleSubmit() {}

  return (
    <React.Fragment>
      <div className="FormResult">
        <div className="Risk">{data.risk_profile}</div>
        <div className="TextFieldForm">{data.alphabetFields}</div>
        <div className="TextFieldForm">{data.year}</div>
        <div className="TextFieldForm">{data.amount}</div>
        <div className="TextFieldForm">{data.age}</div>
      </div>

      <div className="AssetChoice">
        <FormControl>
          <FormLabel id="asset-choice">เลือกลงทุนใน</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="เงินฝากประจำ"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="กองทุนรวมที่ไม่มีสิทธิประโยชน์ทางภาษี"
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="กองทุน RMF"
            />
            <FormControlLabel
              value="4"
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
