import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useSelector } from "react-redux";
import axios from "axios";

const baseURL = "http://localhost:8000";

async function fetchGrowthRate(userStore) {
  await axios
    .get(`${baseURL}/db/get_growthrate`, {
      headers: {
        Authorization: userStore.userToken,
        userId: userStore.userId,
      },
    })
    .then((response) => {
      console.log(response);
      return response;
      // return response;
    })
    .catch((error) => {
      console.log("err :: ", error);
    });
}

export const RmfFactsheet = (data) => {
  const userStore = useSelector((state) => state.userStore);
  const growthRate = fetchGrowthRate(userStore);
  console.log(JSON.stringify(growthRate));
  return (
    <React.Fragment>
      <div>{JSON.stringify(data)}</div>
      <div>{JSON.stringify(growthRate)}</div>
      <div>{JSON.stringify(userStore)}</div>
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
