import React, { useState } from "react";
import Navigate from "components/Navbar";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";

const baseUrl = "localhost:8000/";

export const RmfFactsheet = (data) => {
  return (
    <React.Fragment>
      <div>{JSON.stringify(data)}</div>
      <div className="">
        <div></div>
      </div>
      <div>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          height={300}
        />
      </div>
    </React.Fragment>
  );
};
