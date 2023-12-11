import React, { useState } from "react";
import Navigate from "components/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; // Import Modal from react-bootstrap
import "pages/editpages_form.css";
import mockData from "mockupData/mockData.json";
import Form from "react-bootstrap/Form";

let data = mockData;

export const EditFormPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clickedMonth, setClickedMonth] = useState(null);

  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthDate = new Date(0, monthIndex, 1);
    const monthName = monthDate.toLocaleString('en-US', { month: 'long' });
    return monthName;
  });

  const monthNameToNumber = (monthName) => {
    const monthMap = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };

    return monthMap[monthName] || '';
  };

  const years = Array.from(Array(new Date().getFullYear() - 2010), (_, i) => (i + 2011).toString());

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const handleButtonClick = (month) => {
    setClickedMonth(month);
    setShowModal(true);
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
          <Modal.Title>Editing {clickedMonth} of {selectedYear} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Year: {selectedYear}</p>
          <p>Month: {clickedMonth}</p>

          <Form.Group className="mb-3">
            <Form.Label>Disabled input</Form.Label>
            <Form.Control placeholder="Disabled input" disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Disabled select menu</Form.Label>
            <Form.Select disabled>
              <option>Disabled select</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Can't check this" disabled />
          </Form.Group>
          
          {
            //จัดหมวด 
            console.log(monthNameToNumber(clickedMonth))
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default EditFormPage;