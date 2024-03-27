import React, { useState } from "react";
import Navigate from "components/Navbar";
import { LineChart } from "@mui/x-charts/LineChart";
import { Button, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const DepositFactsheet = (data) => {
  return (
    <React.Fragment>
      <div>{JSON.stringify(data)}</div>
      <div className="header">
        <Stack direction="row" spacing={2}>
          <p>ความเสี่ยงรับได้ของกองทุนคือ</p>
          <p>{JSON.stringify(data.data.data.risk_profile).replace(/"/g, "")}</p>
        </Stack>
      </div>
    </React.Fragment>
  );
};
