import React from 'react';
import Container from '../Container';

import './Footer.sass';

const Footer = () => (
  <footer className="footer">
    <Container>
      <p className="footer__text">
        Made with
        <span role="img" aria-label="Heart"> &#x1F496; </span>
        by Asaf Aviv
      </p>
    </Container>
  </footer>
);

export default Footer;
