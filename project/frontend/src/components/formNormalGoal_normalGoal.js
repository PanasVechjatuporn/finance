import React from "react";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import "./formNormalGoal_normalGoal.css";

export const FormGoal = () => {
  const location = useLocation();
  const risk_profile = location.state.profile;
  return (
    <React.Fragment>
      <div className="MainForm">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <p>ชื่อเป้าหมาย</p>
            <TextField id="name" label="ชื่อเป้าหมาย" variant="outlined" />
          </div>
        </Box>
      </div>

      <div className="SubForm">
        <div>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <p>ระยะเวลาลงทุน</p>
              <TextField id="year" label="ระยะเวลาลงทุน" variant="outlined" />
            </div>
          </Box>
        </div>
      </div>

      <div className="SubForm">
        <div>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <p>เงินเป้าหมาย</p>
              <TextField id="amount" label="เงินเป้าหมาย" variant="outlined" />
            </div>
          </Box>
        </div>
      </div>

      <div className="SubForm">
        <div>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <p>อายุผู้ลงทุน</p>
              <TextField id="age" label="อายุผู้ลงทุน" variant="outlined" />
            </div>
          </Box>
        </div>
      </div>
    </React.Fragment>
  );
};
