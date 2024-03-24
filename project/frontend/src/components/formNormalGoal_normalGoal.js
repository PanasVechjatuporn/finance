import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "./formNormalGoal_normalGoal.css";

export const FormGoal = ({ sendData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const percentage = location.state.Percentage;
  const risk_profile = location.state.profile;
  const goal = location.state.goal;
  console.log(goal)
  const [alphabetFields, setAlphabetFields] = useState("");
  const [numbersFields, setNumbersFields] = useState({
    year: "",
    amount: "",
    age: "",
  });

  const handleAlphabetChange = (e) => {
    const value = e.target.value;
    const isValid = /^[A-Za-z]*$/.test(value); // Regular expression for alphabet validation
    if (isValid) {
      setAlphabetFields(value);
    }
  };

  const handleNumberChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    console.log(name, value);
    const isValid = /^[0-9]*$/.test(value); // Regular expression for number validation
    if (isValid) {
      setNumbersFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleBackButton = () => {
    navigate("../Goal-Based");
  };

  const handleNextButton = () => {
    const combinedData = {
      alphabetFields,
      ...numbersFields,
      risk_profile,
      percentage,
      goal
    };
    console.log(combinedData);
    sendData(combinedData);
  };

  const createTextField = (id, label, variant, value, onChange) => (
    <TextField
      id={id}
      label={value ? "" : label}
      variant={variant}
      value={value}
      onChange={onChange}
    />
  );

  return (
    <React.Fragment>
      <div className="Container">
        <div className="TextField">
          <div>
            <p>ชื่อเป้าหมาย</p>
            {createTextField(
              "name",
              "ชื่อเป้าหมาย",
              "outlined",
              alphabetFields,
              handleAlphabetChange
            )}
          </div>
        </div>

        <div className="TextField">
          <div>
            <div>
              <p>ระยะเวลาลงทุน</p>
              {createTextField(
                "year",
                "ปี",
                "outlined",
                numbersFields.year,
                handleNumberChange
              )}
            </div>
          </div>
        </div>

        <div className="TextField">
          <div>
            <div>
              <p>เงินเป้าหมาย</p>
              {createTextField(
                "amount",
                "บาท",
                "outlined",
                numbersFields.amount,
                handleNumberChange
              )}
            </div>
          </div>
        </div>

        <div className="TextField">
          <div>
            <div>
              <p>อายุผู้ลงทุน</p>
              {createTextField(
                "age",
                "ปี",
                "outlined",
                numbersFields.age,
                handleNumberChange
              )}
            </div>
          </div>
          <br />
          <div>
            <Button variant="outlined" onClick={handleBackButton}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNextButton}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
