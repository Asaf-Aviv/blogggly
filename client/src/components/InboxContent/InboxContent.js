import React from 'react';
import { arrayOf, node } from 'prop-types';

const InboxContent = ({ children }) => (
  <main className="inbox-content__container">
    <div className="inbox-content">
      {children.find(child => child.props.active)}
    </div>
  </main>
);

InboxContent.propTypes = {
  children: arrayOf(node).isRequired,
};

export default InboxContent;
