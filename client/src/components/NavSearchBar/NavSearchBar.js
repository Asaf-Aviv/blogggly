import React, { useState } from 'react';
import { Query } from 'react-apollo';
import queries from '../../graphql/queries';
import NavSearchInput from '../NavSearchInput';
import NavSearchResults from '../NavSearchResults';
import utils from '../../utils';

const NavSearchBar = () => {
  const [postQuery, setPostQuery] = useState('.');
  const [showResults, setShowResults] = useState(false);

  const setShowResultsHandler = nextState => () => setShowResults(nextState);

  return (
    <div className="nav__search-bar">
      <NavSearchInput
        setPostSearchQuery={setPostQuery}
        setShowResults={setShowResultsHandler(true)}
      />
      {postQuery && (
        <Query
          query={queries.SEARCH_POSTS}
          variables={{ postQuery }}
          onError={utils.UIErrorNotifier}
        >
          {({ loading, error, data: { posts } = {} }) => {
            if (loading || error) return null;
            return (
              <NavSearchResults
                showResults={showResults}
                posts={posts}
                hideResults={setShowResultsHandler(false)}
              />
            );
          }}
        </Query>
      )}
    </div>
  );
};

export default NavSearchBar;
