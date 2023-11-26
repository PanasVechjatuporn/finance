import React, { useState } from "react";
import Navigate from "../components/Navbar";
import SelectionFields from "../components/dataSelectionFields_Dashboard";
import Piechart from "../components/dataPiechart_Dashboard";
import DataTableMonth from "../components/dataMonthTable_Dashboard";
import "../styles/layout.css";
import "../styles/dashboard.css";
import mockData from "../mockupData/mockData.json";
import BasicPie from "../components/PieChart";

let data = mockData;
export const Dashboard = () => {
  const dateObjects = data.map((item) => new Date(item.date));

  let selectOption = [];
  dateObjects.forEach((element) => {
    selectOption.push(element.toISOString().slice(0, 7));
  });

  const [startDate, setStartDate] = useState(selectOption[0]);
  const [endDate, setEndDate] = useState(selectOption[selectOption.length - 1]);
  const updateStartDate = (newStartDate) => {
    setStartDate(newStartDate);
  };

  const updateEndDate = (newEndDate) => {
    setEndDate(newEndDate);
  };
  return (
    <React.Fragment>
      <div className="header">
        <Navigate />
      </div>
      <div className="panels">
        <div className="object-1">
          <SelectionFields
            data={data}
            startDate={startDate}
            endDate={endDate}
            onUpdateStartDate={updateStartDate}
            onUpdateEndDate={updateEndDate}
            className="panel-positions"
          />
        </div>
        <div className="object-2">
          <div>
            <Piechart data={data} startDate={startDate} endDate={endDate} />
            <BasicPie />
          </div>
        </div>
        <div className="object-3">
          <DataTableMonth data={data} />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Dashboard;
