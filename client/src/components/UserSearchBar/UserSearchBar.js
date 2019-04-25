import React, { useState, useEffect } from 'react';
import useDebouncedCallback from 'use-debounce/lib/callback';

import './UserSearchBar.sass';
import { func } from 'prop-types';

const UserSearchBar = ({ setUserQuery }) => {
  const [username, setUsername] = useState('');

  const [debouncedCallback] = useDebouncedCallback(
    () => setUserQuery(username),
    300,
  );

  useEffect(() => {
    debouncedCallback(username);
  }, [username]);

  return (
    <header className="search-bar">
      <input
        placeholder="Search a user"
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
