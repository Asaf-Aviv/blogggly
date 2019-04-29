import React from 'react';
import Emoji from '../Emoji';

import './EmptySentence.sass';

const EmptySentence = () => (
  <span className="empty">
    Everything is clear captain
    {' '}
    <Emoji emoji="👌" label="OK hand" />
  </span>
);

export default EmptySentence;
