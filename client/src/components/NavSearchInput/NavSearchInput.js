import React, { useEffect, useState } from 'react';
import { func } from 'prop-types';
import useDebouncedCallback from 'use-debounce/lib/callback';

const NavSearchInput = ({ setPostSearchQuery, setShowResults }) => {
  const [postQuery, setPostQuery] = useState('');

  const [debouncedCallback] = useDebouncedCallback(
    () => setPostSearchQuery(postQuery),
    300,
  );

  useEffect(() => {
    debouncedCallback(postQuery);
  }, [postQuery, debouncedCallback]);

  return (
    <input
      onFocus={setShowResults}
      placeholder="Search posts"
      className="nav__search-bar-input"
      type="text"
      onChange={e => setPostQuery(e.target.value)}
    />
  );
};

NavSearchInput.propTypes = {
  setPostSearchQuery: func.isRequired,
  setShowResults: func.isRequired,
};

export default NavSearchInput;
