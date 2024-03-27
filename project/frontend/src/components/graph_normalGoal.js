import React, { useEffect, useState, useMemo, memo } from "react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Container } from "react-bootstrap";
import { Container as ContainerMui } from "@mui/material";

import { Box, Typography } from "@mui/material";

import { TextField } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import Tooltip from "@mui/material/Tooltip";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

import { useSelector } from "react-redux";
import axios from "axios";
import "./graph_normalGoal.css";
import { formatNumberWithCommas, roundNumber } from "../utils/numberUtil";

const baseURL = "http://localhost:8000";

export const Graph = (data) => {
  // console.log(data);
  const userStore = useSelector((state) => state.userStore);

  const [avgGrowth, setAvgGrowth] = useState(0);
  const [compareFundGrowth, setCompareFundGrowth] = useState(0);

  const [minInvest, setMinInvest] = useState(0);

  const [funds, setFunds] = useState([]);
  const [avgInvest, setAvgInvest] = useState(0);
  const [UserInvestAmount, setUserInvestAmount] = React.useState(0);
  const [UserInvestAmountFix, setUserInvestAmountFix] = React.useState(0);

  const [minAxisX, setMinAxisX] = useState([]); // ปี [1, 2, 3, ..., data.year]
  const [minAxisY, setMinAxisY] = useState([]); // เงินต่อเดือน [2000, 4020.12, 6283.44, ..., data.goal]
  const [userAxisX, setUserAxisX] = useState([]);
  const [userAxisY, setUserAxisY] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [onMount, setOnMount] = useState(true);

  const [dropdowns, setDropdowns] = useState([{ name: "", amount: "" }]);
  const [dropdownsCompareFund, setDropdownsCompareFund] = useState([
    { name: "", amount: "", growthrat_lastmonth: "" },
  ]);

  const [depositTextField, setDepositTextField] = useState(0);

  const memoizedData = useMemo(
    () => ({
      ...data,
    }),
    [data]
  );

  const navigate = useNavigate();

  const addDropdown = () => {
    const newDropdowns = [...dropdowns, { name: "", amount: "" }];
    setDropdowns(newDropdowns);
  };

  const deleteDropdown = (passedIndex) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns.splice(passedIndex, 1);
    setDropdowns(updatedDropdowns);
  };

  const handleDropdownChange = (passedIndex, newVal, type) => {
    if (type == "name") {
      const updatedDropdowns = dropdowns.map((dropdown, index) =>
        index === passedIndex ? { ...dropdown, name: newVal } : dropdown
      );
      setDropdowns(updatedDropdowns);
    } else if (type == "amount") {
      const updatedDropdowns = dropdowns.map((dropdown, index) =>
        index === passedIndex ? { ...dropdown, amount: newVal } : dropdown
      );
      setDropdowns(updatedDropdowns);
    }
  };

  const handleDropdownChangeCompareFund = (passedIndex, newVal, type) => {
    if (type == "name") {
      const updatedDropdowns = dropdownsCompareFund.map((dropdown, index) =>
        index === passedIndex ? { ...dropdown, name: newVal } : dropdown
      );
      setDropdownsCompareFund(updatedDropdowns);
      funds.map((fund) => {
        // console.log(fund.proj_name_th)
        // console.log(newVal)
        // console.log(fund.proj_name_th+' ('+fund.proj_name_en+')')
        if (fund.proj_name_th + " (" + fund.proj_name_en + ")" === newVal) {
          console.log(fund.growthrat_lastmonth);
          setCompareFundGrowth(fund.growthrat_lastmonth);
        }
      });
    } else if (type == "amount") {
      // console.log("passedindex :: ", passedIndex);
      // console.log("newval :: ", newVal);
      // console.log("type :: ", type);
      const updatedDropdowns = dropdownsCompareFund.map((dropdown, index) =>
        index === passedIndex ? { ...dropdown, amount: newVal } : dropdown
      );
      setDropdownsCompareFund(updatedDropdowns);
      setUserInvestAmount(parseFloat(newVal));
    }
    // console.log(dropdownsCompareFund);
  };

  const handleDepositTextField = (e) => {
    console.log(e.target.value);
    console.log(memoizedData.data.percentage);
    setDepositTextField(parseFloat(e.target.value));
  };

  function filterFunds(funds) {
    return funds.filter((item) => {
      // Check if spec_code exists and then convert it to lowercase; use an empty string as fallback
      const specCodeLower = item.spec_code ? item.spec_code.toLowerCase() : "";
      // Check if spec_code does not include 'rmf' or 'ssf'
      return !specCodeLower.includes("rmf") && !specCodeLower.includes("ssf");
    });
  }

  function filterByRiskProfile(funds, riskProfile) {
    const riskToleranceMapping = {
      low: 1,
      "medium low": 4,
      "medium high": 5,
      high: 7,
      "very high": 9,
    };

    const maxRisk = riskToleranceMapping[riskProfile];

    return funds.filter(
      (fund) => fund.risk_spectrum >= 1 && fund.risk_spectrum <= maxRisk
    );
  }

  function createRecommend(riskProfile) {
    switch (riskProfile) {
      case "low":
        return (
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginBottom: "2%",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#757575",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  borderBottom: "2px solid #757575",
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "8px",
                  userSelect: "none",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
                sx={{ textAlign: "center" }}
              >
                คำแนะนำการลงทุน
              </Typography>
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก 60% | กองทุนรวม 40%
              </div>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginTop: "2%",
              }}
            >
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก{" "}
                {formatNumberWithCommas(parseFloat(UserInvestAmount) * 0.6)} บาท
                | กองทุนรวม{" "}
                {formatNumberWithCommas(parseFloat(UserInvestAmount) * 0.4)} บาท
              </div>
            </Box>
          </ContainerMui>
        );
        break;
      case "medium low":
        return (
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginBottom: "2%",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#757575",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  borderBottom: "2px solid #757575",
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "8px",
                  userSelect: "none",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
                sx={{ textAlign: "center" }}
              >
                คำแนะนำการลงทุน
              </Typography>
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก 40% | กองทุนรวม 60%
              </div>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginTop: "2%",
              }}
            >
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก {parseFloat(UserInvestAmount) * 0.4} บาท | กองทุนรวม{" "}
                {parseFloat(UserInvestAmount) * 0.6} บาท
              </div>
            </Box>
          </ContainerMui>
        );
        break;
      case "medium high":
        return (
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginBottom: "2%",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#757575",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  borderBottom: "2px solid #757575",
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "8px",
                  userSelect: "none",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
                sx={{ textAlign: "center" }}
              >
                คำแนะนำการลงทุน
              </Typography>
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก 20% | กองทุนรวม 80%
              </div>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginTop: "2%",
              }}
            >
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก {parseFloat(UserInvestAmount) * 0.2} บาท | กองทุนรวม{" "}
                {parseFloat(UserInvestAmount) * 0.8} บาท
              </div>
            </Box>
          </ContainerMui>
        );
        break;
      case "high":
        return (
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginBottom: "2%",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#757575",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  borderBottom: "2px solid #757575",
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "8px",
                  userSelect: "none",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
                sx={{ textAlign: "center" }}
              >
                คำแนะนำการลงทุน
              </Typography>
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก 10% | กองทุนรวม 90%
              </div>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginTop: "2%",
              }}
            >
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก {parseFloat(UserInvestAmount) * 0.1} บาท | กองทุนรวม{" "}
                {parseFloat(UserInvestAmount) * 0.9} บาท
              </div>
            </Box>
          </ContainerMui>
        );
        break;
      case "very high":
        return (
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginBottom: "2%",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#757575",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  borderBottom: "2px solid #757575",
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "8px",
                  userSelect: "none",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
                sx={{ textAlign: "center" }}
              >
                คำแนะนำการลงทุน
              </Typography>
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก 5% | กองทุนรวม 95%
              </div>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "48%",
                maxHeight: "48%",
                marginTop: "2%",
              }}
            >
              <div
                style={{
                  width: "100%", // Make div take the full width of its parent
                  display: "flex", // Apply display flex
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically (if there are multiple lines or elements)
                  textAlign: "center", // Ensure text within the div is centered if not behaving as expected
                }}
              >
                เงินฝาก {parseFloat(UserInvestAmount) * 0.05} บาท | กองทุนรวม{" "}
                {parseFloat(UserInvestAmount) * 0.95} บาท
              </div>
            </Box>
          </ContainerMui>
        );
        break;
      default:
        break;
    }
  }

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

  async function fetchData(userStore) {
    try {
      const fundsResponse = await axios.get("http://localhost:8000/db/funds");
      // const newFundsObject = filterFunds(fundsResponse.data);
      // console.log(newFundsObject)
      const suitableFunds = filterByRiskProfile(
        fundsResponse.data,
        memoizedData.data.riskProfile
      );

      console.log(suitableFunds);
      // setFunds(newFundsObject);
      // setFunds(fundsResponse.data);
      setFunds(suitableFunds);
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
      const invest = Math.round(
        (memoizedData.data.percentage / 100) * avgInvest_temp
      );
      if (onMount) {
        console.log("set first value");
        console.log(invest);
        setUserInvestAmount(invest);
        setUserInvestAmountFix(invest);
        setOnMount(false);
      }
    } catch (err) {
      console.log("Err at fetchData function: ", err);
    }
  }

  async function minInvestGraph(res) {
    let data_list = [];
    res[0].data.findResult.forEach((e) => {
      if (e.growthrat_lastmonth == null) {
        // do nothing
      } else {
        data_list.push(e.growthrat_lastmonth);
      }
    });
    const sum = data_list.reduce(
      (accum, value) => accum + parseFloat(value),
      0.0
    );
    const obj = memoizedData.data; // Ensure this data structure is correct and stable
    const annualGrowthRate = Math.abs(sum / data_list.length / 100);
    const n = parseInt(obj.year) * 12;
    const r = annualGrowthRate / 12;
    const monthlyInvest = (parseFloat(obj.amount) * r) / ((1 + r) ** n - 1);
    // AxisX calculation remains the same
    let listAxisX = [];
    for (let i = 0; i <= parseInt(obj.year); i++) {
      listAxisX.push(i);
    }

    // Optimized AxisY calculation
    let listAxisY = [];
    let accum = 0;
    let accum_2 = 0;
    for (let i = 0; i <= parseInt(obj.year); i++) {
      // Calculate monthlyGrowthPercentage with the updated values
      let monthlyGrowthPercentage = r + 1;
      for (let j = 1; j <= 12; j++) {
        // Corrected loop increment
        if (i === 0 && j === 1) {
          accum_2 += monthlyInvest;
          listAxisY.push(Math.round(accum));
        } else if (i === 0 && j !== 1) {
          accum_2 *= monthlyGrowthPercentage;
          accum_2 += monthlyInvest;
        } else if (i === 1 && j === 1) {
          accum = accum_2;
          listAxisY.push(Math.round(accum));
          accum *= monthlyGrowthPercentage;
          accum += monthlyInvest;
        } else if (i === 1 && j > 1) {
          accum *= monthlyGrowthPercentage;
          accum += monthlyInvest;
        } else if (i > 1 && j === 1) {
          listAxisY.push(Math.round(accum));
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
    setCompareFundGrowth(Math.abs(annualGrowthRate * 100));
    setMinAxisX(listAxisX);
    setMinAxisY(listAxisY);
  }

  async function userInvestGraph(res) {
    try {
      const obj = memoizedData.data; // Ensure this data structure is correct and stable
      // AxisX calculation remains the same
      let listAxisX = [];
      for (let i = 0; i <= parseInt(obj.year); i++) {
        listAxisX.push(i);
      }

      // Optimized AxisY calculation
      let listAxisY = [];
      let accum = 0;
      let accum_2 = 0;
      for (let i = 0; i <= parseInt(obj.year); i++) {
        // Calculate monthlyGrowthPercentage with the updated values
        let monthlyGrowthPercentage =
          parseFloat(compareFundGrowth) / 12 / 100 + 1;
        for (let j = 1; j <= 12; j++) {
          // Corrected loop increment
          if (i === 0 && j === 1) {
            accum_2 += UserInvestAmount;
            listAxisY.push(Math.round(accum));
          } else if (i === 0 && j !== 1) {
            accum_2 *= monthlyGrowthPercentage;
            accum_2 += UserInvestAmount;
          } else if (i === 1 && j === 1) {
            accum = accum_2;
            listAxisY.push(Math.round(accum));
            accum *= monthlyGrowthPercentage;
            accum += UserInvestAmount;
          } else if (i === 1 && j > 1) {
            accum *= monthlyGrowthPercentage;
            accum += UserInvestAmount;
          } else if (i > 1 && j === 1) {
            listAxisY.push(Math.round(accum));
            accum *= monthlyGrowthPercentage;
            accum += UserInvestAmount;
          } else {
            accum *= monthlyGrowthPercentage;
            accum += UserInvestAmount;
          }
        }
      }
      setUserAxisX(listAxisX);
      setUserAxisY(listAxisY);
    } catch (error) {
      console.log("Error in userInvestGraph function: ", error);
    }
  }

  useEffect(() => {
    console.log(memoizedData.data.percentage);
    Promise.all([fetchGrowthRate(userStore), fetchData(userStore)]).then(
      (res) => {
        minInvestGraph(res);
        userInvestGraph(res);
        setIsLoading(true);
      }
    );
  }, [userStore, UserInvestAmount, dropdownsCompareFund]);
  // compareFundGrowth

  function saveTaxGoal(e) {
    e.preventDefault();
    // const Funds = dropdowns.map((item) => {
    // return { fundName: item.name.split(" (")[0], amount: item.amount };
    // });

    console.log(memoizedData.data);
    const Funds = dropdowns.map((item) => {
      return { fundName: item.name.split(" (")[0], amount: item.amount };
    });

    let totalFundAmount = Funds.reduce(
      (acc, item) => acc + parseFloat(item.amount),
      0.0
    );

    console.log(depositTextField);
    console.log(totalFundAmount);
    if (depositTextField !== 0) {
      totalFundAmount += parseFloat(depositTextField);
    }
    console.log(totalFundAmount);
    const obj = Funds.map((item) => {
      // Find a matching item in 'funds'
      const match = funds.find(
        (item_fund) => item.fundName === item_fund.proj_name_th
      );

      // If a match is found, return the matching item from 'funds' (or merge data as needed)
      if (match) {
        return {
          amount: parseFloat(item.amount),
          fundName: item.fundName,
          unit: parseFloat(item.amount) / parseFloat(match.last_val),
          assetType: "fund",
          spec_code: match.spec_code,
          buyDay: new Date().getDate(),
          buyMonth: new Date().getMonth(),
          buyYear: new Date().getFullYear(),
          buyPrice: match.last_val,
        }; // This merges 'item' from 'Funds' with the matching 'item_fund' from 'funds'
      }

      // If no match is found, just return the original item from 'Funds'
      return item;
    });

    // depositTextField = 121

    console.log(obj);

    if (depositTextField !== 0) {
      obj.push({
        fundName: "เงินฝากประจำ",
        amount: parseFloat(depositTextField),
        unit: null,
        assetType: "deposit",
        spec_code: null,
        buyDay: new Date().getDate(),
        buyMonth: new Date().getMonth(),
        buyYear: new Date().getFullYear(),
        buyPrice: null,
      });
      console.log("deposit has been pushed");
    } else {
      console.log("No push");
    }

    console.log(obj);

    if (Funds.includes("")) {
      alert("กรุณาใส่ข้อมูลให้ครบ");
    } else if (totalFundAmount > UserInvestAmount) {
      alert("ห้ามกรอกเกินเงินลงทุนต่อเดือน");
    } else if (totalFundAmount < UserInvestAmount) {
      alert("ผลรวมของกองทุนที่เลือก ต้องเท่ากับเงินลงทุนต่อเดือน");
    } else {
      axios.post(`${baseURL}/db/upsert_new_goal`, {
        userId: userStore.userId,
        Name: memoizedData.data.alphabetFields,
        year: memoizedData.data.year,
        Goal: memoizedData.data.amount,
        Funds: obj,
        Percentage: memoizedData.data.percentage,
      });

      axios
        .post(
          `${baseURL}/db/change_goal_percentage`,
          { userId: userStore.userId, goal: memoizedData.data.goal },
          {
            headers: {
              Authorization: userStore.userToken,
              UserId: userStore.userId,
            },
          }
        )
        .then(navigate("/Goal-Based"));
    }
  }

  return (
    <React.Fragment>
      {/* <div>{JSON.stringify(memoizedData.data.data.goal)}</div> */}
      {/* <div>{JSON.stringify(avgGrowth)}</div> */}
      {/* <div>{JSON.stringify(minAxisX)}</div> */}
      {/* <div>{JSON.stringify(minAxisY.length)}</div> */}
      {/* <div>{JSON.stringify(userAxisX)}</div> */}
      {/* <div>{JSON.stringify(userAxisY.length)}</div> */}
      {/* <div>{JSON.stringify(memoizedData.data.data.year)}</div> */}
      {/* <div>{JSON.stringify(UserInvestAmount)}</div> */}
      <Grid container marginTop={1}>
        <Grid item xs={4}>
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                width: "100%",
                height: "100%",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                minHeight: "68vh",
                maxHeight: "68vh",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#757575",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  borderBottom: "2px solid #757575",
                  display: "inline-block",
                  width: "100%",
                  paddingBottom: "8px",
                  userSelect: "none",
                  marginBottom: "12px",
                  fontWeight: "bold",
                }}
                sx={{ textAlign: "center" }}
              >
                เงินลงทุนที่แนะนำ{" "}
                {formatNumberWithCommas(Math.round(minInvest))} บาทต่อเดือน
              </Typography>
              {isLoading ? (
                <LineChart
                  sx={{
                    "& .MuiLineElement-series-Predict": {
                      strokeDasharray: "10 5",
                      strokeWidth: 4,
                    },
                    // border: "1px solid #757575",
                    position: "absolute",
                  }}
                  xAxis={[{ data: minAxisX, label: "ปี" }]}
                  series={[
                    {
                      id: "Recommend",
                      data: minAxisY,
                      label: "เงินลงทุนที่แนะนำ",
                      showMark: false,
                    },
                    {
                      id: "Predict",
                      data: userAxisY,
                      label: "เงินที่คาดว่าจะเติบโต (Predict)",
                      showMark: false,
                    },
                  ]}
                  width={500}
                  height={300}
                  grid={{ vertical: true, horizontal: true }}
                />
              ) : (
                <p>waiting for graph to load...</p>
              )}
              <div>
                <Typography
                  variant="h5"
                  style={{
                    color: "#757575",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    borderBottom: "2px solid #757575",
                    display: "inline-block",
                    width: "100%",
                    paddingBottom: "8px",
                    userSelect: "none",
                    marginBottom: "12px",
                    fontWeight: "bold",
                  }}
                  sx={{ textAlign: "center" }}
                >
                  เงินลงทุนขั้นต่ำต่อเดือน{" "}
                  {formatNumberWithCommas(Math.round(UserInvestAmountFix))} บาท
                </Typography>
              </div>
              <div>
                <Container
                  style={{
                    display: "flex",
                    marginTop: 20,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {dropdownsCompareFund.map((dropdown, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      <div style={{ width: "50%", marginRight: 5 }}>
                        <Autocomplete
                          freeSolo
                          //isOptionEqualToValue={(option, value) => option == value || '' == value}
                          id="compareFund"
                          disableClearable
                          value={dropdown.name}
                          onChange={(e) =>
                            handleDropdownChangeCompareFund(
                              index,
                              e.target.innerHTML,
                              "name"
                            )
                          }
                          options={funds.map(
                            (item) =>
                              item.proj_name_th + ` (${item.proj_name_en})`
                          )}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              label="กองทุน"
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                        />
                      </div>
                      <TextField
                        required
                        label="จำนวนเงิน (บาท)"
                        style={{ width: "20%" }}
                        value={dropdown.amount}
                        onChange={(e) => {
                          handleDropdownChangeCompareFund(
                            index,
                            e.target.value,
                            "amount"
                          );
                          // console.log(e.target.innerHTML);
                        }}
                      />
                    </div>
                  ))}
                </Container>
              </div>
            </Box>
          </ContainerMui>
        </Grid>
        <Grid item xs={4}>
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "33vh",
                maxHeight: "33vh",
                marginBottom: "1vh",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    color: "#757575",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    borderBottom: "2px solid #757575",
                    display: "inline-block",
                    width: "100%",
                    paddingBottom: "8px",
                    userSelect: "none",
                    marginBottom: "12px",
                    fontWeight: "bold",
                  }}
                  sx={{ textAlign: "center" }}
                >
                  กองทุนรวม
                </Typography>
                {dropdowns.map((dropdown, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "60%", marginRight: 5 }}>
                      <Autocomplete
                        freeSolo
                        //isOptionEqualToValue={(option, value) => option == value || '' == value}
                        id="free-solo-2-demo"
                        disableClearable
                        value={dropdown.name}
                        onChange={(e) =>
                          handleDropdownChange(
                            index,
                            e.target.innerHTML,
                            "name"
                          )
                        }
                        options={funds.map(
                          (item) =>
                            item.proj_name_th + ` (${item.proj_name_en})`
                        )}
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            label="กองทุน"
                            InputProps={{
                              ...params.InputProps,
                              type: "search",
                            }}
                          />
                        )}
                      />
                    </div>
                    <TextField
                      required
                      label="จำนวนเงิน (บาท)"
                      style={{ width: "30%" }}
                      value={dropdown.amount}
                      onChange={(e) => {
                        handleDropdownChange(index, e.target.value, "amount");
                        console.log(e.target.innerHTML);
                      }}
                    />
                    {index == dropdowns.length - 1 ? (
                      <IconButton onClick={addDropdown}>
                        <AddIcon color="success" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={(e) => deleteDropdown(index)}>
                        <ClearIcon color="error" />
                      </IconButton>
                    )}
                  </div>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "hidden",
                minHeight: "34vh",
                maxHeight: "34vh",
                marginTop: "1vh",
              }}
            >
              <Grid container spacing={1} sx={{ height: "100%" }}>
                <Grid item xs={12} sx={{ height: "50%" }}>
                  <Box
                    sx={{
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        color: "#757575",
                        textDecoration: "underline",
                        textDecorationColor: "transparent",
                        borderBottom: "2px solid #757575",
                        display: "inline-block",
                        width: "100%",
                        paddingBottom: "8px",
                        userSelect: "none",
                        marginBottom: "12px",
                        fontWeight: "bold",
                      }}
                      sx={{ textAlign: "center" }}
                    >
                      เงินฝาก
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        required
                        id="outlined-number"
                        label="จำนวนเงิน (บาท)"
                        style={{ width: "50%" }}
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          handleDepositTextField(e);
                        }}
                      />
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ContainerMui>
        </Grid>
        <Grid item xs={4}>
          <ContainerMui maxWidth="md">
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "true",
                minHeight: "33vh",
                maxHeight: "33vh",
                marginBottom: "1vh",
              }}
            >
              <Container
                style={{
                  display: "flex",
                  width: "50%",
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <form
                  onSubmit={(e) => {
                    saveTaxGoal(e);
                  }}
                >
                  <IconButton type="submit">
                    <Button variant="contained">Create Goal</Button>
                  </IconButton>
                </form>

              </Container>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowY: "hidden",
                minHeight: "34vh",
                maxHeight: "34vh",
                marginTop: "1vh",
              }}
            >
              {createRecommend(memoizedData.data.riskProfile)}
            </Box>
          </ContainerMui>
        </Grid>
      </Grid>

      <Grid container marginTop={2}>
        <Grid item xs={12}>
          <ContainerMui maxWidth="false">
            <Box
              sx={{
                boxSizing: "border-box",
                width: "100%",
                height: "100%",
                borderRadius: 6,
                boxShadow: 6,
                padding: 2,
                display: "flex",
                flexDirection: "column", // Changed to column for vertical layout of children
                position: "relative",
                overflowX: "hidden", // Prevent horizontal scrolling at the Box level
              }}
            >
              <Typography marginBottom={2} fontWeight={"bold"}>
                กองทุนที่แนะนำ
              </Typography>
              <div
                style={{
                  display: "flex", // Added for horizontal layout
                  flexDirection: "row", // Ensure children are laid out in a row
                  overflowX: "auto", // Enable horizontal scrolling
                  marginLeft: 5,
                }}
              >
                {funds.slice(0, 20).map((item, index) => (
                  <Container
                    key={index}
                    style={{
                      padding: 6,
                      backgroundColor: "white",
                      marginRight: 20, // Adjusted for spacing between items, from marginBottom to marginRight
                      alignItems: "center",
                      textAlign: "center",
                      borderRadius: 20,
                      borderWidth: 1,
                      borderStyle: "solid",
                      minWidth: 500, // Optional: Ensure each container has a minimum width for better layout control
                    }}
                  >
                    <div
                      style={{
                        paddingTop: 25,
                        paddingLeft: 25,
                        paddingRight: 25,
                        position: "relative",
                      }}
                    >
                      <Typography>{item.proj_name_th}</Typography>
                      <Typography>{item.proj_name_en}</Typography>
                      <Typography>
                        อัตราการเติบโต : {formatNumberWithCommas(item.growthrat_lastmonth)} %
                      </Typography>
                      <div style={{ position: "absolute", right: 0, top: 0 }}>
                        <Tooltip title="ข้อมูลกองทุน" placement="right">
                          <Link
                            to={item.url_factsheet}
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            <IconButton>
                              <DescriptionIcon
                                fontSize={"small"}
                                color="info"
                              />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                  </Container>
                ))}
              </div>
            </Box>
          </ContainerMui>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
