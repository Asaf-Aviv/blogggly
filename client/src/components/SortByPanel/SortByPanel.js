import React from 'react';
import { func } from 'prop-types';
import Button from '../Button';

const SortByPanel = ({ setSortBy }) => (
  <div className="sort-by__container">
    <span className="sort-by">Sort by:</span>
    <Button
      classes="sort-by__btn"
      onClick={() => setSortBy({ key: 'createdAt', order: 'desc' })}
      text="Newest"
    />
    <Button
      classes="sort-by__btn"
      onClick={() => setSortBy({ key: 'createdAt', order: 'asc' })}
      text="Oldest"
    />
    <Button
      classes="sort-by__btn"
      onClick={() => setSortBy({ key: 'likesCount', order: 'desc' })}
      text="Best"
    />
  </div>
);

SortByPanel.propTypes = {
  setSortBy: func.isRequired,
};

export default SortByPanel;
