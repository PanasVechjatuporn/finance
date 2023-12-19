import React, { useState } from "react";
import Navigate from "components/Navbar";
import mockData from "mockupData/mockData.json";
import Piechart from "components/DataPiechart_Dashboard";
import MonthDataTable from "components/DataTable_Dashboard";
import SelectionFields from "components/DataSelectionFields_Dashboard";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Card, Nav } from "react-bootstrap";
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
            <Navigate></Navigate>
                <Grid container spacing={8}>
                    <Grid item xs={8}>

                        <SelectionFields
                            data={data}
                            startDate={startDate}
                            endDate={endDate}
                            onUpdateStartDate={updateStartDate}
                            onUpdateEndDate={updateEndDate}
                        />

                    </Grid>
                    <Grid item xs={2}>
                        <Piechart data={data} startDate={startDate} endDate={endDate} />
                    </Grid>
                </Grid>

                <Container>
                    <MonthDataTable data={data} startDate={startDate} endDate={endDate} />
                </Container>
                <Container>
                    <Button variant="danger">
                        <Link
                            to={"./edit-form"}
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            Edit
                        </Link>
                    </Button>
                </Container>
        </React.Fragment>
    );
};
export default Dashboard;
