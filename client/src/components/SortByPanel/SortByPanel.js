import React from 'react';
import { func } from 'prop-types';

const SortByPanel = ({ setSortBy }) => (
  <div className="sort-by__container">
    <span className="sort-by">Sort by:</span>
    <button
      className="sort-by__btn"
      type="button"
      onClick={() => setSortBy({ key: 'createdAt', order: 'desc' })}
    >
      Newest
    </button>
    <button
      className="sort-by__btn"
      type="button"
      onClick={() => setSortBy({ key: 'createdAt', order: 'asc' })}
    >
      Oldest
    </button>
    <button
      className="sort-by__btn"
      type="button"
      onClick={() => setSortBy({ key: 'likesCount', order: 'desc' })}
    >
      Best
    </button>
  </div>
);

SortByPanel.propTypes = {
  setSortBy: func.isRequired,
};

export default SortByPanel;
