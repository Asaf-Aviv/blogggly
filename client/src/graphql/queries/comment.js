
import gql from 'graphql-tag';

export const GET_COMMENTS_BY_IDS = gql`
  query getCommentsByIds(
    $commentIds: [ID!]!,
    $withPostInfo: Boolean = false,
  ) {
    comments: getCommentsByIds(commentIds: $commentIds) {
      _id
      body
      createdAt
      likesCount
      likes
      post @include (if: $withPostInfo) {
        _id
        title
        author {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const POST_COMMENTS = gql`
  query postComments($postId: ID!) {
    comments: postComments(postId: $postId) {
      _id
      body
      createdAt
      likesCount
      likes
      author {
        _id
        username
        avatar
      }
    }
  }
`;
