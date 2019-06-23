import { useState, useEffect } from 'react';
import utils from '../utils';

const useMemberForms = (isLogged) => {
  const [showMemberForms, setShowMemberForms] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isLogged && showMemberForms) {
      setShowMemberForms(false);
    }
    if (showMemberForms) {
      utils.lockScrollBody();
    } else {
      utils.unlockScrollBody();
    }
  }, [isLogged, showMemberForms]);

  const toggleForms = () => {
    setShowLogin(!showLogin);
  };

  return {
    showMemberForms,
    setShowMemberForms,
    showLogin,
    setShowLogin,
    toggleForms,
  };
};

export default useMemberForms;
