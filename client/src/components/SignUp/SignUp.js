import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';
import Loader from '../Loader';
import { FormContext } from '../../context';

const SIGNUP = gql`
  mutation signup($userInput: UserInput) {
    signup(userInput: $userInput) {
      user {
        _id
        username
        email
        posts
        avatar
        createdAt
        updatedAt
        comments
      }
    }
  }
`;

const SignUp = ({ toggleForms, hideForms }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setLoggedUser } = useContext(FormContext);

  return (
    <Mutation
      mutation={SIGNUP}
      variables={{ userInput: { username, email, password } }}
      errorPolicy="all"
      onCompleted={({ signup }) => {
        setLoggedUser(signup.user);
        setToken(signup.token);
        hideForms();
      }}
    >
      {(signup, { loading, error }) => (
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
          {error && (
            <pre>
              {error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))}
            </pre>
          )}
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
