import React, { useEffect, useState, useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useSelector } from "react-redux";
import axios from "axios";
import "./rmfGraph_normalGoal.css";

const baseURL = "http://localhost:8000";

async function fetchGrowthRate(userStore) {
  try {
    const resFetchNewData = await axios.get(`${baseURL}/db/get_growthrate`, {
      headers: {
        Authorization: userStore.userToken,
        userId: userStore.userId,
      },
    });
    return resFetchNewData;
  } catch (err) {
    console.log("err: ", err);
  }
}

export const RmfFactsheet = (data) => {
  const userStore = useSelector((state) => state.userStore);
  const [avgGrowth, setAvgGrowth] = useState(0);
  const [minInvest, setMinInvest] = useState(0);
  const [axisX, setAxisX] = useState([]); // ปี [1, 2, 3, ..., data.year]
  const [axisY, setAxisY] = useState([]); // เงินต่อเดือน [2000, 4020.12, 6283.44, ..., data.goal]
  const memoizedData = useMemo(
    () => ({
      ...data,
    }),
    [data]
  );
  useEffect(() => {
    Promise.all([fetchGrowthRate(userStore)]).then((res) => {
      let data_list = [];
      res[0].data.findResult.forEach((e) => {
        data_list.push(e.growthrat_lastmonth);
      });
      const sum = data_list.reduce(
        (accum, value) => accum + parseFloat(value),
        0.0
      );
      const obj = memoizedData.data.data; // Ensure this data structure is correct and stable
      const annualGrowthRate = Math.abs(sum / data_list.length / 100);
      const n = parseInt(obj.year) * 12;
      const r = annualGrowthRate / 12;
      const monthlyInvest = (parseInt(obj.amount) * r) / ((1 + r) ** n - 1);
      console.log("Monthly investment: ", monthlyInvest);
      // AxisX calculation remains the same
      let listAxisX = [];
      for (let i = 1; i <= parseInt(obj.year); i++) {
        listAxisX.push(i);
      }

      // Optimized AxisY calculation
      let listAxisY = [];
      let accum = 0;
      console.log(accum);
      for (let i = 1; i <= parseInt(obj.year); i++) {
        // Calculate monthlyGrowthPercentage with the updated values
        let monthlyGrowthPercentage = r + 1;
        console.log("monthlyGrowthPercentage ", monthlyGrowthPercentage);
        for (let j = 1; j <= 12; j++) {
          // Corrected loop increment
          if (i === 1 && j === 1) {
            accum += monthlyInvest;
          } else {
            accum *= monthlyGrowthPercentage;
            accum += monthlyInvest;
          }
        }
        listAxisY.push(accum);
      }

      // Update state once after all calculations
      setAvgGrowth(Math.abs(annualGrowthRate * 100));
      setMinInvest(monthlyInvest);
      setAxisX(listAxisX);
      setAxisY(listAxisY);
      console.log(listAxisX);
      console.log(listAxisY);
    });
  }, [userStore, memoizedData.data.data]);

  return (
    <React.Fragment>
      <div>{JSON.stringify(memoizedData.data.data)}</div>
      <div>{JSON.stringify(avgGrowth)}</div>
      <div>{JSON.stringify(axisX)}</div>
      <div>{JSON.stringify(axisY)}</div>
      <div className="resultGraph">
        <p>{JSON.stringify(memoizedData.data.selectedValue)}</p>
      </div>
      <div className="resultGraph">
        <p>เงินลงทุนขั้นต่ำต่อเดือน {minInvest}</p>
      </div>
      <div className="resultGraph">
        {axisX.length > 0 && axisY.length > 0 ? (
          <LineChart
            xAxis={[{ data: axisX }]}
            series={[
              {
                data: axisY,
              },
            ]}
            width={500}
            height={300}
          />
        ) : (
          <p>waiting for graph to load...</p>
        )}
      </div>
    </React.Fragment>
  );
};
