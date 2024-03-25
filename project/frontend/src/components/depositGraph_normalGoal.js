import React, { useEffect, useState, useMemo } from "react";
import Navigate from "components/Navbar";
import { LineChart } from "@mui/x-charts/LineChart";
import { Button, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./depositGraph_normalGoal.css";

const baseURL = "http://localhost:8000";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const DepositFactsheet = (data) => {
  const userStore = useSelector((state) => state.userStore);

  const [avgGrowth, setAvgGrowth] = useState(0);

  const [minInvest, setMinInvest] = useState(0);

  const [funds, setFunds] = useState([]);
  const [avgInvest, setAvgInvest] = useState(0);
  const [UserInvestAmount, setUserInvestAmount] = React.useState(0);

  const [minAxisX, setMinAxisX] = useState([]); // ปี [1, 2, 3, ..., data.year]
  const [minAxisY, setMinAxisY] = useState([]); // เงินต่อเดือน [2000, 4020.12, 6283.44, ..., data.goal]
  const [userAxisX, setUserAxisX] = useState([]);
  const [userAxisY, setUserAxisY] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [dropdowns, setDropdowns] = useState([{ name: "", amount: "" }]);

  const memoizedData = useMemo(
    () => ({
      ...data,
    }),
    [data]
  );

  const navigate = useNavigate();

  async function fetchData(userStore) {
    try {
      const fundsResponse = await axios.get("http://localhost:8000/db/funds");
      setFunds(fundsResponse.data);
      const userData = await axios.get(
        `http://localhost:8000/db/userdata=${userStore.userId}`
      );
      let sumOfInvest = 0;
      userData.data.forEach((item) => {
        if (item.investmentData == null) {
          //Do nothing
        } else {
          sumOfInvest += parseInt(item.investmentData);
        }
      });
      const avgInvest_temp = sumOfInvest / 12;
      setAvgInvest(avgInvest_temp);
      console.log(memoizedData.data, avgInvest_temp);
      // console.log(memoizedData.data.data.percentage, avgInvest_temp)
      const invest = Math.round(
        (memoizedData.data.data.percentage / 100) * avgInvest_temp
      );
      console.log("Invest: ", invest);
      setUserInvestAmount(invest);
    } catch (err) {
      console.log("Err at fetchData function: ", err);
    }
  }

  async function minInvestGraph(userStore) {
    setAvgGrowth(1.7);
    const annualGrowthRate = 0.017;
    const n = parseInt(obj.year) * 12;
    const r = annualGrowthRate / 12;
    const monthlyInvest = (parseInt(obj.amount) * r) / ((1 + r) ** n - 1);
    let listAxisX = [];
    const obj = memoizedData.data.data;
    for (let i = 0; i <= parseInt(obj.year) + 1; i++) listAxisX.push(i);

    let listAxisY = [];
    let accum = 0;
    let accum_2 = 0;
    for (let i = 0; i <= parseInt(obj.year) + 1; i++) {
      let monthlyGrowthPercentage = r + 1;
      for (let j = 1; j <= 12; j++) {
        // Corrected loop increment
        if (i === 0 && j === 1) {
          accum_2 += monthlyInvest;
          listAxisY.push(accum);
        } else if (i === 0 && j !== 1) {
          accum_2 *= monthlyGrowthPercentage;
          accum_2 += monthlyInvest;
        } else if (i === 1 && j === 1) {
          accum = accum_2;
          listAxisY.push(accum);
          accum *= monthlyGrowthPercentage;
          accum += monthlyInvest;
        } else if (i === 1 && j > 1) {
          accum *= monthlyGrowthPercentage;
          accum += monthlyInvest;
        } else if (i > 1 && j === 1) {
          listAxisY.push(accum);
          accum *= monthlyGrowthPercentage;
          accum += monthlyInvest;
        } else {
          accum *= monthlyGrowthPercentage;
          accum += monthlyInvest;
        }
      }
    }
    // Update state once after all calculations
    setAvgGrowth(Math.abs(annualGrowthRate * 100));
    setMinInvest(monthlyInvest);
    setMinAxisX(listAxisX);
    setMinAxisY(listAxisY);
  }

  useEffect(() => {
    // Promise.all([fetchGrowthRate(userStore)]).then(
    Promise.all([fetchData(userStore)]).then((res) => {
      minInvestGraph(res);
      // userInvestGraph(res);
      // setIsLoading(true);
    });
  }, [userStore]);

  return (
    <React.Fragment>
      <div>{JSON.stringify(data)}</div>
      <div className="resultGraph">
        <p>ssf</p>
      </div>
      <div className="resultGraph">
        <p>เงินลงทุนขั้นต่ำต่อเดือน {minInvest} บาท</p>
      </div>
    </React.Fragment>
  );
};
