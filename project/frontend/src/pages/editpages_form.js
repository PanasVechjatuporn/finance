import React, { useState, useEffect } from "react";
import Navigate from "components/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import "pages/editpages_form.css";
import mockData from "mockupData/mockData.json";
import Form from "react-bootstrap/Form";

let data = mockData;

export const EditFormPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clickedMonth, setClickedMonth] = useState(null);
  const [showYearSelectionModal, setShowYearSelectionModal] = useState(false);
  const [dataStatus, setDataStatus] = useState({});

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
    if (selectedYear) {
      setClickedMonth(month);
      setShowModal(true);
    } else {
      setShowYearSelectionModal(true);
    }
  };

  const handleCloseYearSelectionModal = () => {
    setShowYearSelectionModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const checkDataStatus = () => {
      const status = {};

      data.forEach((entry) => {
        const dateParts = entry.date.split('-');
        const year = dateParts[0];
        const month = dateParts[1];

        if (!status[year]) {
          status[year] = {};
        }

        status[year][month] = true;
      });

      setDataStatus(status);
    };

    checkDataStatus();
  }, []);

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
                variant={dataStatus[selectedYear]?.[index + 1] ? 'success' : 'danger'}
                style={{ marginRight: '8px', padding: '10px', border: '1px solid #ccc' }}
                onClick={() => handleButtonClick(month)}
              >
                {month}
              </Button>
            ))}
          </div>
        </>
      </div>
      <Modal show={showYearSelectionModal} onHide={handleCloseYearSelectionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Please select a year first</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please choose a year before selecting a month.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseYearSelectionModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
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