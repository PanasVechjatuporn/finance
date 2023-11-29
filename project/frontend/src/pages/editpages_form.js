import React, { useState } from "react";
import Navigate from "components/Navbar";
import Button from "react-bootstrap/Button";
import "pages/editpages_form.css";
import mockData from "mockupData/mockData.json";
let data = mockData
export const EditFormPage = () => {
  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthDate = new Date(0, monthIndex, 1);
    const monthName = monthDate.toLocaleString('en-US', { month: 'long' });
    return monthName;
  });
  console.log('months ::', months)
  return (
    <React.Fragment>
      <div className="header">
        <Navigate />
      </div>
      <div className="content">
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {months.map((month, index) => (
              <Button variant="primary" style={{ marginRight: '8px' , padding: '10px', border: '1px solid #ccc'}}>{month}</Button>
            ))}
          </div>
        </>
      </div>
    </React.Fragment>
  );
};
export default EditFormPage;
