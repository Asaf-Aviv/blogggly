import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const POST_LIKES_UPDATES = gql`
  subscription postLikesUpdates($postId: ID!) {
    postLikesUpdates(postId: $postId) {
      _id
      likes
      likesCount
    }
  }
`;
