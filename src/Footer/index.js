import React from 'react';
import './footer.scss';

const Footer = () => (
  <footer>
    <div>
      <p> {new Date().getFullYear()} – This is an open-source project under the BSD license</p>
    </div>
    </footer>
);

export default Footer;