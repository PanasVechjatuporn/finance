import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
var monthString
var year
var month

const EditMonthDataModal = ({ show, onClose, clickedMonth }) => {
    if (show === true) {
        year = new Date(clickedMonth.date).getFullYear()
        month = new Date(clickedMonth.date).getMonth()
        monthString = new Date(clickedMonth.date).toLocaleString('en-us', { month: 'long' })
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editing {monthString} of {year}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>
                    <Row>
                        <p></p>
                        <Col md={6}>
                            {/* Form content here */}
                        </Col>
                        <Col md={6}>
                            {/* Form content here */}
                        </Col>
                    </Row>
                </Form>

                {/* Additional content */}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditMonthDataModal;