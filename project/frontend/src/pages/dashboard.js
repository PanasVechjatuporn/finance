import React from "react";
import Navigate from "components/Navbar";
import MonthDataTable from "components/DataTable_Dashboard";
export const Dashboard = () => {
    return (
        <React.Fragment>
            <Navigate />
            <MonthDataTable />
        </React.Fragment>
    );
};

