import { Collapse, Card, Form, Row, Col } from 'react-bootstrap';

const FilterCollapse = ({ show, status, setStatus, statusCounts }) => {
    return (
        <Collapse in={show}>
            <div id="collapseExample">
                <Card className="mb-2">
                    <Card.Body>
                        <div className="page-table-header mb-2">
                            <Row>
                                <Col xs={12} md={3} xl={3}>
                                    <Form.Group controlId="statusSelect">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="1">Pending ({statusCounts.pending})</option>
                                            <option value="2">Approved ({statusCounts.approved})</option>
                                            <option value="3">Rejected ({statusCounts.rejected})</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Collapse>
    );
};

export default FilterCollapse;
