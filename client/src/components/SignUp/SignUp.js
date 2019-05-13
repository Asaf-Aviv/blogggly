
import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { func } from 'prop-types';
import Loader from '../Loader';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Label from '../Label';
import Input from '../Input';

const SignUp = ({ toggleForms, hideForms }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.SIGNUP}
      variables={{ userInput: { username, email, password } }}
      errorPolicy="all"
      onError={utils.UIErrorNotifier}
      onCompleted={({ signup: currentUser }) => {
        console.log(currentUser);
        setLoggedUser(() => currentUser);
        setToken(currentUser.token);
        hideForms();
      }}
    >
      {(signup, { loading }) => (
        <form
          className="member-form animated fadeIn"
          onClick={e => e.stopPropagation()}
          onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}
        >
          <button
            className="member-form__close-btn"
            type="button"
            onClick={hideForms}
          >
            <i className="fas fa-times" />
          </button>
          <h1 className="member-form__title">Sign Up</h1>
          <Label labelFor="username">
            <Input
              onChange={setUsername}
              value={username}
              iconClasses="fas fa-user"
              placeholder="Username"
              validateFunc={utils.validateUsername}
              required
            />
          </Label>
          <Label labelFor="email">
            <Input
              onChange={setEmail}
              value={email}
              inputType="email"
              iconClasses="fas fa-envelope"
              placeholder="Email"
              validateFunc={utils.validateEmail}
              autoComplete
              required
            />
          </Label>
          <Label labelFor="password">
            <Input
              onChange={setPassword}
              value={password}
              inputType="password"
              iconClasses="fas fa-lock"
              placeholder="Password"
              validateFunc={utils.validatePassword}
              tooltipText="Password must contain atleast eight characters, one letter and one number."
              autoComplete
              required
            />
          </Label>
          <span className="forgot">Forgot your password?</span>
          <button
            className="member-form__submit btn btn--primary"
            type="submit"
          >
            Sign Up
          </button>
          <span
            className="member-form__toggle"
            onClick={toggleForms}
          >
            Already a member?
            <span className="member-form__toggle-inner"> Log In</span>
          </span>
          {loading && <Loader />}
        </form>
      )}
    </Mutation>
  );
};

SignUp.propTypes = {
  toggleForms: func.isRequired,
  hideForms: func.isRequired,
};

export default SignUp;
