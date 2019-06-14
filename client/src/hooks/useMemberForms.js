import { useState, useEffect } from 'react';

const useMemberForms = (isLogged) => {
  const [showMemberForms, setShowMemberForms] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isLogged && !showMemberForms) {
      setShowMemberForms(false);
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
