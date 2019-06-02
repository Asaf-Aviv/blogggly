import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { func } from 'prop-types';
import Label from '../Label';
import Input from '../Input';
import Loader from '../Loader';
import { UserContext } from '../../context';
import utils from '../../utils';
import queries from '../../graphql/queries';
import Button from '../Button';

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
        setLoggedUser(() => currentUser);
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
          <Button
            classes="member-form__close-btn"
            onClick={hideForms}
          >
            <i className="fas fa-times" />
          </Button>
          <h1 className="member-form__title">Login</h1>
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
          <Button type="submit" className="member-form__submit btn btn--primary" text="Login" />
          <span
            className="member-form__toggle"
            onClick={toggleForms}
          >
            Don&apos;t have an account?
            <span className="member-form__toggle-inner"> Sign Up</span>
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
