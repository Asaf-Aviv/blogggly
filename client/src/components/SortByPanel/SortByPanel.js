import React from 'react';
import { func } from 'prop-types';

const SortByPanel = ({ setSortBy }) => (
  <div className="sort-by__container">
    <span className="sort-by">Sort by:</span>
    <button
      className="sort-by__btn"
      type="button"
      onClick={() => setSortBy('DATE_ASC')}
    >
      Newest
    </button>
    <button
      className="sort-by__btn"
      type="button"
      onClick={() => setSortBy('DATE_DESC')}
    >
      Oldest
    </button>
    <button
      className="sort-by__btn"
      type="button"
      onClick={() => setSortBy('LIKES')}
    >
      Best
    </button>
  </div>
);

SortByPanel.propTypes = {
  setSortBy: func.isRequired,
};

export default SortByPanel;
