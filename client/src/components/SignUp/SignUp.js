
import React, { useState, useContext } from 'react';
import Alert from 'react-s-alert';
import { Mutation } from 'react-apollo';
import { func } from 'prop-types';
import { Helmet } from 'react-helmet';
import Loader from '../Loader';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Label from '../Label';
import Input from '../Input';
import Button from '../Button';

const SignUp = ({ toggleForms, hideForms }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, setLoggedUser, isDarkMode } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.SIGNUP}
      onError={utils.UIErrorNotifier}
      onCompleted={({ signup: currentUser }) => {
        setLoggedUser(() => currentUser);
        setToken(currentUser.token);
      }}
    >
      {(signup, { loading }) => (
        <form
          className="member-form animated fadeIn"
          onClick={e => e.stopPropagation()}
          onSubmit={(e) => {
            e.preventDefault();
            const recaptcha = document.querySelector('.g-recaptcha-response').value;

            if (!recaptcha) {
              Alert.info('Please click on the reCAPTCHA box');
              return;
            }

            signup({
              variables: {
                signupInput: {
                  credentials: { username, email, password },
                  recaptcha,
                },
              },
            });
          }}
        >
          <Helmet>
            <script src="https://www.google.com/recaptcha/api.js" />
          </Helmet>
          <Button
            classes="member-form__close-btn"
            onClick={hideForms}
          >
            <i className="fas fa-times" />
          </Button>
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
          <div
            data-theme={isDarkMode ? 'dark' : 'light'}
            className="g-recaptcha"
            data-sitekey="6LfIlagUAAAAANtuiAwKeI-W2AmHZZg8hrsGtjlQ"
          />
          <Button
            classes="member-form__submit btn btn--primary"
            text="Sign Up"
            type="submit"
          />
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
