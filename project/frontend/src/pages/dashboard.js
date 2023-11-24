import React, { useState } from "react";
import Navigate from "../components/Navbar";
import SelectionFields from "../components/dataSelectionFields_Dashboard";
import Piechart from "../components/dataPiechart_Dashboard";
import DataTableMonth from "../components/dataMonthTable_Dashboard";
import './dashboard.css';
import mockData from '../mockupData/mockData.json';
let data = mockData;
export const Dashboard = () => {
    const [startDate, setStartDate] = useState('2023-10');
    const [endDate, setEndDate] = useState('2023-12');

    const handleStartDateChange = (selectedDate) => {
        setStartDate(selectedDate);
    };

    const handleEndDateChange = (selectedDate) => {
        setEndDate(selectedDate);
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
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
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
