import React, { useContext } from 'react';
import Login from '../Login';
import SignUp from '../SignUp';
import { MemberFormsContext } from '../../context';

import './MemberForms.sass';

const MemberForms = () => {
  const { toggleForms, showLogin, setShowMemberForms } = useContext(MemberFormsContext);

  const hideForms = () => setShowMemberForms(false);

  return (
    <div className="member-form__container" onClick={hideForms}>
      {showLogin
        ? <Login toggleForms={toggleForms} hideForms={hideForms} />
        : <SignUp toggleForms={toggleForms} hideForms={hideForms} />
    }
    </div>
  );
};

export default MemberForms;
