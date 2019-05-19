import gql from 'graphql-tag';

export const NEW_FRIEND_REQUEST = gql`
  subscription newFriendRequest($currentUserId: ID!) {
    newFriendRequest(currentUserId: $currentUserId) {
      _id
      username
      avatar
    }
  }
`;
