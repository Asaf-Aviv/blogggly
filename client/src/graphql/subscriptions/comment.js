import gql from 'graphql-tag';

export const NEW_POST_COMMENT = gql`
  subscription newPostComment($postId: ID!) {
    newPostComment(postId: $postId) {
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

export const THEY_COMMENT_ON_MY_POST = gql`
  subscription {
    theyCommentOnMyPost {
      _id
      avatar
      username
    }
  }
`;
