import React, { useState } from "react";
import Navigate from "components/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; // Import Modal from react-bootstrap
import "pages/editpages_form.css";
import mockData from "mockupData/mockData.json";

let data = mockData;

export const EditFormPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthDate = new Date(0, monthIndex, 1);
    const monthName = monthDate.toLocaleString('en-US', { month: 'long' });
    return monthName;
  });

  const years = Array.from(Array(new Date().getFullYear() - 2010), (_, i) => (i + 2011).toString());

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const handleButtonClick = (month) => {
    // Handle logic to open modal with the selectedYear and month
    setShowModal(true);
    // Add your logic to handle the modal data or open your modal here
    console.log('Selected Year:', selectedYear);
    console.log('Selected Month:', month);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <div className="header">
        <Navigate />
      </div>
      <div className="content">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedYear || 'Choose year'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {years.map((year) => (
              <Dropdown.Item
                key={year}
                onClick={() => handleYearSelect(year)}
                style={{ marginRight: '8px', padding: '10px', border: '1px solid #ccc' }}
              >
                {year}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {months.map((month, index) => (
              <Button
                key={month}
                variant="primary"
                style={{ marginRight: '8px', padding: '10px', border: '1px solid #ccc' }}
                onClick={() => handleButtonClick(month)}
              >
                {month}
              </Button>
            ))}
          </div>
        </>
      </div>
      {/* Modal for displaying additional information */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selected Year: {selectedYear}</p>
          {/* Add additional modal content here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default EditFormPage;