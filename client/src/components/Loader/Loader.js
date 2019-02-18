import React from 'react';

import './Loader.sass';

const Loader = () => (
  <div className="loader">
    <div className="lds-roller">
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Loader;
