import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { func } from 'prop-types';
import Loader from '../Loader';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import utils from '../../utils';

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
        setLoggedUser(currentUser);
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
          <label className="member-form__label" htmlFor="username">
            Username
            <i className="member-form__icon fas fa-user" />
            <input
              className="member-form__input"
              autoComplete="true"
              type="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <i className="member-form__icon fas fa-check" />
          </label>
          <label className="member-form__label" htmlFor="email">
            Email
            <i className="member-form__icon fas fa-envelope" />
            <input
              className="member-form__input"
              autoComplete="true"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <i className="member-form__icon fas fa-check" />
          </label>
          <label className="member-form__label" htmlFor="password">
            Password
            <i className="member-form__icon fas fa-lock" />
            <input
              className="member-form__input"
              autoComplete="true"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <i className="member-form__icon fas fa-check" />
          </label>
          <span className="forgot">Forgot your password?</span>
          <button
            className="member-form__btn btn btn--primary"
            type="submit"
          >
            Sign Up
          </button>
          <span
            className="member-form__toggle"
            onClick={toggleForms}
          >
            Already a member?
            <span className="inner"> Log In</span>
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
