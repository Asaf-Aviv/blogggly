import React, { useState, useContext } from 'react';
import { Mutation, Query } from 'react-apollo';
import Alert from 'react-s-alert';
import { shape, string } from 'prop-types';
import Button from '../Button';
import Input from '../Input';
import queries from '../../graphql/queries';
import { MemberFormsContext } from '../../context';
import utils from '../../utils';

const ResetPassword = ({ match: { params: { resetToken } } }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

  return (
    <Query
      query={queries.VALIDATE_RESET_TOKEN}
      variables={{ resetToken }}
      fetchPolicy="network-only"
      errorPolicy="all"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) {
          utils.UIErrorNotifier(error);
          return null;
        }
        return (
          <Mutation
            mutation={queries.RESET_PASSWORD}
            variables={{ email: data.validateResetToken, password, confirmPassword }}
            onError={utils.UIErrorNotifier}
            onCompleted={() => {
              setPassword('');
              setConfirmPassword('');
              Alert.success('Password changed successfully');
              setShowLogin(true);
              setShowMemberForms(true);
            }}
          >
            {resetPassword => (
              <div className="reset-password">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  resetPassword();
                }}
                >
                  <Input
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="New Password"
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm New Password"
                  />
                  <Button type="submit" text="Confirm" />
                </form>
              </div>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

ResetPassword.propTypes = {
  match: shape({
    params: shape({
      resetToken: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ResetPassword;
