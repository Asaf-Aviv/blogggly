import React from 'react';
import { string } from 'prop-types';

const Emoji = ({ emoji, label }) => (
  <span aria-label={label}>{emoji}</span>
);

Emoji.propTypes = {
  label: string.isRequired,
  emoji: string.isRequired,
};

export default Emoji;
