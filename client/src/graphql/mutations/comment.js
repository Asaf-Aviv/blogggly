import gql from 'graphql-tag';

export const ADD_COMMENT = gql`
  mutation newComment($postId: ID!, $body: String!) {
    newComment(postId: $postId, body: $body) {
      _id
      author {
        _id
        username
        avatar
      }
      body
      createdAt
      likes
      likesCount
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(commentId: $commentId, postId: $postId)
  }
`;

export const TOGGLE_LIKE_ON_COMMENT = gql`
  mutation toggleLikeOnComment($commentId: ID!) {
    toggleLikeOnComment(commentId: $commentId) {
      _id
      likesCount
      likes
    }
  }
`;
