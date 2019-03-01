import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { func } from 'prop-types';
import Loader from '../Loader';
import { UserContext } from '../../context';
import utils from '../../utils';
import queries from '../../graphql/queries';

const Login = ({ toggleForms, hideForms }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.LOGIN}
      variables={{ email, password }}
      errorPolicy="all"
      onError={utils.UIErrorNotifier}
      onCompleted={({ login: currentUser }) => {
        setLoggedUser(currentUser);
        setToken(currentUser.token);
        hideForms();
      }}
    >
      {(login, { loading }) => (
        <form
          className="member-form animated fadeIn"
          onClick={e => e.stopPropagation()}
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <button
            className="member-form__close-btn"
            type="button"
            onClick={hideForms}
          >
            <i className="fas fa-times" />
          </button>
          <h1 className="member-form__title">Login</h1>
          <label className="member-form__label" htmlFor="email">
            <i className="member-form__icon fas fa-envelope" />
            Email
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
          <button className="member-form__btn btn btn--primary" type="submit">Login</button>
          <span
            className="member-form__toggle"
            onClick={toggleForms}
          >
            Don&apos;t have an account?
            <span className="inner"> Sign Up</span>
          </span>
          {loading && <Loader />}
        </form>
      )}
    </Mutation>
  );
};

Login.propTypes = {
  toggleForms: func.isRequired,
  hideForms: func.isRequired,
};

export default Login;
