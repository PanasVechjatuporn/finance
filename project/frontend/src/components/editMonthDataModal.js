import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const EditMonthDataModal = ({ show, onClose, clickedMonth, selectedYear, data }) => {
    console.log('data ::', data)
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editing {clickedMonth} of {selectedYear}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Year: {selectedYear}</p>
                <p>Month: {clickedMonth}</p>

                <Form>
                    <Row>
                        <p>Income</p>
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