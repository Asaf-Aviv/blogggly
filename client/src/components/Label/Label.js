import React from 'react';
import {
  string, node, arrayOf, oneOfType,
} from 'prop-types';
import capitalize from 'lodash.capitalize';

import './Label.sass';

const Label = ({
  labelFor, text, classes, children,
}) => (
  <label className={`label ${classes}`} htmlFor={labelFor}>
    {text || capitalize(labelFor)}
    {children}
  </label>
);

Label.propTypes = {
  labelFor: string.isRequired,
  text: string,
  classes: string,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

Label.defaultProps = {
  classes: '',
  text: '',
};

export default Label;
