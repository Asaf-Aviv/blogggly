import React, { useState } from 'react';
import { func } from 'prop-types';
import Login from '../Login';
import SignUp from '../SignUp';

import './MemberForms.sass';

const MemberForms = ({ hideForms }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const toggleForms = () => {
    setShowSignUp(!showSignUp);
    setShowLogin(!showLogin);
  };

  return (
    <div className="member-form__container" onClick={hideForms}>
      {showLogin
        ? <Login toggleForms={toggleForms} hideForms={hideForms} />
        : <SignUp toggleForms={toggleForms} hideForms={hideForms} />
      }
    </div>
  );
};

MemberForms.propTypes = {
  hideForms: func.isRequired,
};

export default MemberForms;
