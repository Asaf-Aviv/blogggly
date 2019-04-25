import React from 'react';
import { arrayOf, node } from 'prop-types';

const InboxContent = ({ children }) => (
  <div className="inbox-content__container">
    <div className="inbox-content">
      {children.find(child => child.props.active)}
    </div>
  </div>
);

InboxContent.propTypes = {
  children: arrayOf(node).isRequired,
};

export default InboxContent;
