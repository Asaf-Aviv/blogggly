import React from 'react';
import { arrayOf, bool, func } from 'prop-types';
import { SearchPostPropTypes } from '../../propTypes';
import NavSearchItem from '../NavSearchItem';

const NavSearchResults = ({ posts, showResults, hideResults }) => (
  <div className={`nav-search-results ${showResults ? 'nav-search-results--active' : ''}`}>
    <button type="button" className="nav-search-results__close-btn" onClick={hideResults}>
      <i className="fa fa-times" />
    </button>
    {posts.length > 0
      ? (
        <ul className="nav-search-results__list">
          {posts.map(post => (
            <NavSearchItem key={post._id} post={post} hideResults={hideResults} />
          ))}
        </ul>
      )
      : <h3>No posts found</h3>
    }
  </div>
);

NavSearchResults.propTypes = {
  posts: arrayOf(SearchPostPropTypes).isRequired,
  showResults: bool.isRequired,
  hideResults: func.isRequired,
};

export default NavSearchResults;
