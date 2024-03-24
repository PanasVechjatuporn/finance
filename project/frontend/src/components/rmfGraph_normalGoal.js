import React, { useEffect, useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Container } from "react-bootstrap";

import { TextField } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import Tooltip from "@mui/material/Tooltip";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

import { useSelector } from "react-redux";
import axios from "axios";
import "./rmfGraph_normalGoal.css";

const baseURL = "http://localhost:8000";

export const RmfFactsheet = (data, setShowChooseFund) => {
  console.log(data)
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
      const invest = Math.round(
        (memoizedData.data.data.percentage / 100) * avgInvest_temp
      );
      setUserInvestAmount(invest);
    } catch (err) {
      console.log("Err at fetchData function: ", err);
    }
  }

  async function minInvestGraph(res) {
    let data_list = [];
    res[0].data.findResult.forEach((e) => {
      if (e.growthrat_lastmonth == null){
        // do nothing
      }else{
        data_list.push(e.growthrat_lastmonth);
      }
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
    // AxisX calculation remains the same
    let listAxisX = [];
    for (let i = 0; i <= parseInt(obj.year) + 1; i++) {
      listAxisX.push(i);
    }

    // Optimized AxisY calculation
    let listAxisY = [];
    let accum = 0;
    let accum_2 = 0;
    for (let i = 0; i <= parseInt(obj.year) + 1; i++) {
      // Calculate monthlyGrowthPercentage with the updated values
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

  async function userInvestGraph(res) {
    const obj = memoizedData.data.data; // Ensure this data structure is correct and stable
    // AxisX calculation remains the same
    let listAxisX = [];
    for (let i = 0; i <= parseInt(obj.year) + 1; i++) {
      listAxisX.push(i);
    }

    // Optimized AxisY calculation
    let listAxisY = [];
    let accum = 0;
    let accum_2 = 0;
    for (let i = 0; i < parseInt(obj.year) + 1; i++) {
      // Calculate monthlyGrowthPercentage with the updated values
      let monthlyGrowthPercentage = avgGrowth / 12 / 100 + 1;
      for (let j = 1; j <= 12; j++) {
        // Corrected loop increment
        if (i === 0 && j === 1) {
          accum_2 += UserInvestAmount;
          listAxisY.push(accum);
        } else if (i === 0 && j !== 1) {
          accum_2 *= monthlyGrowthPercentage;
          accum_2 += UserInvestAmount;
        } else if (i === 1 && j === 1) {
          accum = accum_2;
          listAxisY.push(accum);
          accum *= monthlyGrowthPercentage;
          accum += UserInvestAmount;
        } else if (i === 1 && j > 1) {
          accum *= monthlyGrowthPercentage;
          accum += UserInvestAmount;
        } else if (i > 1 && j === 1) {
          listAxisY.push(accum);
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
  }



  useEffect(() => {
    Promise.all([fetchGrowthRate(userStore), fetchData(userStore)]).then(
      (res) => {
        minInvestGraph(res);
        userInvestGraph(res);
        setIsLoading(true);
      }
    );
  }, [userStore, memoizedData.data.data, UserInvestAmount, avgGrowth]);

  function saveTaxGoal(e) {
    const Funds = dropdowns.map((item) => {
      return { fundName: item.name.split(" (")[0], amount: item.amount };
    });

    const totalFundAmount = Funds.reduce(
      (acc, item) => acc + parseInt(item.amount),
      0
    );

    if (Funds.includes("")) {
      alert("กรุณาใส่ข้อมูลให้ครบ");
    } else if (totalFundAmount > UserInvestAmount) {
      alert("ห้ามกรอกเกินเงินลงทุนต่อเดือน");
    } else if (totalFundAmount < UserInvestAmount) {
      alert("ผลรวมของกองทุนที่เลือก ต้องเท่ากับเงินลงทุนต่อเดือน")
    }
    else {
      axios
        .post(`${baseURL}/db/upsert_new_goal`, {
          userId: userStore.userId,
          Name: memoizedData.data.data.alphabetFields,
          year: memoizedData.data.data.year,
          Funds: { ...Funds },
          Percentage: memoizedData.data.data.percentage,
        })
        .then(navigate("/Goal-Based"));

      axios.post(
        `${baseURL}/db/change_goal_percentage`,
        { userId: userStore.userId,
          goal: memoizedData.data.data.goal, },
        {
            headers: {
                Authorization: userStore.userToken,
                UserId: userStore.userId
            },
        }
    )
    }
    e.preventDefault();
  }

  return (
    <React.Fragment>
      <div>{JSON.stringify(memoizedData.data.data.goal)}</div>
      <div>{JSON.stringify(avgGrowth)}</div>
       <div>{JSON.stringify(minAxisX)}</div>
       <div>{JSON.stringify(minAxisY)}</div>
       <div>{JSON.stringify(userAxisX)}</div>
       <div>{JSON.stringify(userAxisY)}</div>
       <div>{JSON.stringify(UserInvestAmount)}</div>

      <div className="resultGraph">
        <p>{JSON.stringify(memoizedData.data.selectedValue)}</p>
      </div>
      <div className="resultGraph">
        <p>เงินลงทุนขั้นต่ำต่อเดือน {minInvest} บาท</p>
      </div>
      <div className="resultGraph">
        {isLoading ? (
          <LineChart
            xAxis={[{ data: minAxisX }]}
            series={[
              {
                data: minAxisY,
                label: "เงินลงทุนที่แนะนำ",
              },
              {
                data: userAxisY,
                label: "เงินลงทุน",
              },
            ]}
            width={500}
            height={300}
          />
        ) : (
          <p>waiting for graph to load...</p>
        )}
      </div>

      <div className="resultGraph">
        <p>เงินลงทุนขั้นต่ำต่อเดือน {UserInvestAmount} บาท</p>
      </div>
      <div className="resultGraph">
        {isLoading ? (
          <LineChart
            xAxis={[{ data: userAxisX }]}
            series={[
              {
                data: userAxisY,
              },
            ]}
            width={500}
            height={300}
          />
        ) : (
          <p>waiting for graph to load...</p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          saveTaxGoal(e);
        }}
      >
        <div className="resultGraph">
          <div className="suggestion">
            <Typography marginBottom={2} fontWeight={"bold"}>
              กองทุนที่แนะนำ
            </Typography>
            <div style={{ marginLeft: 5 }}>
              {funds.slice(0, 4).map((item, index) => (
                <Container
                  key={index}
                  style={{
                    padding: 6,
                    backgroundColor: "white",
                    marginBottom: 20,
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "gray",
                  }}
                >
                  <div
                    style={{
                      padding: 35,
                      paddingLeft: 25,
                      paddingRight: 25,
                      position: "relative",
                    }}
                  >
                    <Typography>{item.proj_name_th}</Typography>
                    <Typography>{item.proj_name_en}</Typography>
                    <Typography>
                      อัตราการเติบโต : {item.growthrat_lastmonth}
                    </Typography>
                    <div style={{ position: "absolute", right: 0, top: 0 }}>
                      <Tooltip title="ข้อมูลกองทุน" placement="right">
                        <Link
                          to={item.url_factsheet}
                          style={{ textDecoration: "none", color: "white" }}
                        >
                          <IconButton>
                            <DescriptionIcon fontSize={"small"} color="info" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                </Container>
              ))}
            </div>
          </div>
        </div>
        <Container
          style={{
            display: "flex",
            marginTop: 20,
            width: "50%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {dropdowns.map((dropdown, index) => (
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
                  id="free-solo-2-demo"
                  disableClearable
                  value={dropdown.name}
                  onChange={(e) =>
                    handleDropdownChange(index, e.target.innerHTML, "name")
                  }
                  options={funds.map(
                    (item) => item.proj_name_th + ` (${item.proj_name_en})`
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
          <Container
            style={{
              display: "flex",
              width: "50%",
              marginBottom: 20,
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <IconButton type="submit">
              <Button variant="contained">Create Goal</Button>
            </IconButton>
          </Container>
        </Container>
      </form>
    </React.Fragment>
  );
};
