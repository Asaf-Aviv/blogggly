import React from 'react';
import { func, string } from 'prop-types';
import Button from '../Button';
import Emoji from '../Emoji';

import './SortByPanel.sass';

const SortByPanel = ({ setSortBy, sortByKey }) => {
  const renderSortBtn = (text, active, sortBy, children) => (
    <Button
      classes={`link ${active ? '' : 'link--inactive'}`}
      onClick={() => setSortBy(sortBy)}
      text={text}
    >
      {' '}
      {children}
    </Button>
  );

  return (
    <div className="sort-by__container">
      <h4 className="sort-by">Sort by:</h4>
      {renderSortBtn(
        'Newest',
        sortByKey === 'createdAtdesc',
        { key: 'createdAt', order: 'desc' },
        <i className="fas fa-caret-up" />,
      )}
      <span className="slash">/</span>
      {renderSortBtn(
        'Oldest',
        sortByKey === 'createdAtasc',
        { key: 'createdAt', order: 'asc' },
        <i className="fas fa-caret-down" />,
      )}
      <span className="slash">/</span>
      {renderSortBtn(
        'Best', sortByKey === 'likesCountdesc',
        { key: 'likesCount', order: 'desc' },
        <Emoji emoji="🚀" label="rocket" />,
      )}
    </div>
  );
};

SortByPanel.propTypes = {
  sortByKey: string.isRequired,
  setSortBy: func.isRequired,
};

export default SortByPanel;
