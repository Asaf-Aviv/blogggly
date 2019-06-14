import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { Mutation } from 'react-apollo';
import Button from '../Button';
import Input from '../Input';
import queries from '../../graphql/queries';
import utils from '../../utils';

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
        <div className="forgot-password">
          <Input type="email" value={email} onChange={setEmail} placeholder="Enter email" />
          <Button onClick={forgotPassword} text="Reset Password" />
        </div>
      )}
    </Mutation>
  );
};

export default Forgot;
