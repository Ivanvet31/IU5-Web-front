import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

export const AppNavbar = () => {
  return (
    <Navbar bg="white" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          REcovery<span className="logo--accent">Time</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/strategies" className="nav-link-custom">
              Стратегии восстановления
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
