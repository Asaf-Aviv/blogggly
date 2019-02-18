import React from 'react';
import { node, arrayOf, oneOfType } from 'prop-types';

import './Container.sass';

const Container = ({ children }) => (
  <div className="container">{children}</div>
);

Container.propTypes = {
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

export default Container;
