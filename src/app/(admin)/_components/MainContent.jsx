'use client';

import { Col, Container, Row } from 'react-bootstrap';

const MainContent = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <main className="flex-grow-2">{children}</main>
        </Col>
      </Row>
    </Container>
  );
};

export default MainContent;
