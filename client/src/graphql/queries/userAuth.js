import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const VALIDATE_RESET_TOKEN = gql`
  query validateResetToken($resetToken: String!) {
    validateResetToken(resetToken: $resetToken)
  }
`;
