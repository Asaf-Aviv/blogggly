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

export const NEW_POST_COMMENT = gql`
  subscription newPostComment($postId: ID!, $currentUserId: ID) {
    newPostComment(postId: $postId, currentUserId: $currentUserId) {
      _id
      author {
        _id
        avatar
        username
      }
      body
      createdAt
      likes
      likesCount
    }
  }
`;
