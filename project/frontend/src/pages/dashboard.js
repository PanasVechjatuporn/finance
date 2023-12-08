import React, { useState } from "react";
import Navigate from "components/Navbar";
import mockData from "mockupData/mockData.json";
import DataTableMonth from "components/DataMonthTable_Dashboard";
import Piechart from "components/DataPiechart_Dashboard";
import CollapsibleTable from "components/DataTable_Dashboard";
import SelectionFields from "components/DataSelectionFields_Dashboard";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "styles/dashboard/dashboard.css";
import "styles/dashboard/layout.css";

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
                <div className="panel-info">
                    <SelectionFields
                        data={data}
                        startDate={startDate}
                        endDate={endDate}
                        onUpdateStartDate={updateStartDate}
                        onUpdateEndDate={updateEndDate}
                    />
                </div>
                <div className="panel-info">
                    <Piechart data={data} startDate={startDate} endDate={endDate} />
                </div>
                <div className="panel-positions">
                    <CollapsibleTable data={data} />
                </div>
            </div>

            <div className="btn">
                <Button variant="danger">
                    <Link
                        to={"./edit-form"}
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        Edit
                    </Link>
                </Button>{" "}
            </div>
        </React.Fragment>
    );
};
export default Dashboard;
