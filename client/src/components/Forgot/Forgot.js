import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { Mutation } from 'react-apollo';
import Button from '../Button';
import Input from '../Input';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Container from '../Container';

import './Forgot.sass';

const Forgot = () => {
  const [email, setEmail] = useState('');

  return (
    <Mutation
      mutation={queries.FORGOT_PASSWORD}
      variables={{ email }}
      onError={utils.UIErrorNotifier}
      onCompleted={() => {
        Alert.success(`Password reset link sent to ${email}`);
      }}
    >
      {forgotPassword => (
        <Container>
          <div className="forgot-password">
            <form className="forgot-password__form" onSubmit="forgotPassword">
              <h3 className="forgot-password__form-title">Forgot Password</h3>
              <Input type="email" value={email} onChange={setEmail} placeholder="Enter email" />
              <Button onClick={forgotPassword} text="Reset Password" classes="btn btn--primary" />
            </form>
          </div>
        </Container>
      )}
    </Mutation>
  );
};

export default Forgot;
