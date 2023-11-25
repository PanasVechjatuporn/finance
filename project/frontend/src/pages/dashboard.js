import React, { useState } from "react";
import Navigate from "../components/Navbar";
import SelectionFields from "../components/dataSelectionFields_Dashboard";
import Piechart from "../components/dataPiechart_Dashboard";
import DataTableMonth from "../components/dataMonthTable_Dashboard";
import './dashboard.css';
import mockData from '../mockupData/mockData.json';
let data = mockData;
export const Dashboard = () => {
    const dateObjects = data.map(item => new Date(item.date));
  
    let selectOption = [];
    dateObjects.forEach(element => {
      selectOption.push(
        element.toISOString().slice(0, 7)
      );
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
            <div className='header'>
                <Navigate />
            </div>
            <div className="object-1">
                <SelectionFields
                    data={data}
                    startDate={startDate}
                    endDate={endDate}
                    onUpdateStartDate={updateStartDate}
                    onUpdateEndDate={updateEndDate}
                />
            </div>
            <div className="object-2">
                <Piechart 
                   data={data}
                   startDate={startDate}
                   endDate={endDate}
                />
            </div>
            <div className="object-3">
                <DataTableMonth data={data} />
            </div>
        </React.Fragment>
    );
}
export default Dashboard;
