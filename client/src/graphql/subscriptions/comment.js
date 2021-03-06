import gql from 'graphql-tag';

export const NEW_POST_COMMENT = gql`
  subscription newPostComment($postId: ID!) {
    newPostComment(postId: $postId) {
      _id
      body
      createdAt
      likes
      likesCount
      author {
        _id
        avatar
        username
      }
    }
  }
`;

export const DELETED_POST_COMMENT = gql`
  subscription deletedPostComment($postId: ID!) {
    deletedPostComment(postId: $postId)
  }
`;

export const COMMENT_LIKES_UPDATES = gql`
  subscription commentLikesUpdates($postId: ID!) {
    commentLikesUpdates(postId: $postId) {
      _id
      likes
      likesCount
    }
  }
`;
