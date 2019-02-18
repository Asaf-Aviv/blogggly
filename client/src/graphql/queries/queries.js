import gql from 'graphql-tag';

export const RELOG = gql`
  query {
    relog {
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

export const ALL_USERS = gql`
  query {
    users {
      username
      avatar
    }
  }
`;
