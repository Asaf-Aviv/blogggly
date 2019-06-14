import React, { useEffect, useState } from 'react';
import { func } from 'prop-types';
import useDebouncedCallback from 'use-debounce/lib/callback';
import Input from '../Input';

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
    <Input
      onFocus={setShowResults}
      value={postQuery}
      placeholder="Search posts"
      onChange={setPostQuery}
    />
  );
};

NavSearchInput.propTypes = {
  setPostSearchQuery: func.isRequired,
  setShowResults: func.isRequired,
};

export default NavSearchInput;
