import gql from 'graphql-tag';

export const CREATE_POST = gql`
  mutation createPost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      _id
      title
      body
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const TOGGLE_LIKE_ON_POST = gql`
  mutation toggleLikeOnPost($postId: ID!) {
    toggleLikeOnPost(postId: $postId) {
      _id
      likesCount
      likes
    }
  }
`;
