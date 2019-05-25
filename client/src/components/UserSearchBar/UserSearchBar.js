import React, { useState, useEffect } from 'react';
import useDebouncedCallback from 'use-debounce/lib/callback';
import { func } from 'prop-types';

import './UserSearchBar.sass';

const UserSearchBar = ({ setUserQuery }) => {
  const [username, setUsername] = useState('.');

  const [debouncedCallback] = useDebouncedCallback(
    () => setUserQuery(username),
    300,
  );

  useEffect(() => {
    debouncedCallback(username);
  }, [username, debouncedCallback]);

  return (
    <header className="search-bar">
      <input
        placeholder="Search users"
        className="search-bar__input"
        type="text"
        onChange={e => setUsername(e.target.value)}
      />
    </header>
  );
};

UserSearchBar.propTypes = {
  setUserQuery: func.isRequired,
};

export default UserSearchBar;
