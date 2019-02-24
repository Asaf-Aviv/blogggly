import gql from 'graphql-tag';

export const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: ID, $userId: ID) {
    toggleLike(postId: $postId, userId: $userId) {
      likes
    }
  }
`;

export const POST = gql`
  query post($postId: ID) {
    post(postId: $postId) {
      _id
      title
      body
      createdAt
      updatedAt
      author {
        avatar
        username
      }
      likeCount
      likes
    }
  }
`;

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

export const ADD_COMMENT = gql`
  mutation createComment($comment: CommentInput) {
    createComment(comment: $comment) {
      _id
    }
  }
`;

export const COMMENTS = gql`
  query postComments($postId: ID) {
    postComments(postId: $postId) {
      _id
      body
      createdAt
      updatedAt
      author {
        _id
        username
        avatar
      }
    }
  } 
`;
