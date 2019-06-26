import React from 'react';
import { node, string } from 'prop-types';

import './Main.sass';

const Main = ({ classes, children }) => (
  <main className={`main ${classes}`}>{children}</main>
);

Main.propTypes = {
  classes: string,
  children: node.isRequired,
};

Main.defaultProps = {
  classes: '',
};

export default Main;
