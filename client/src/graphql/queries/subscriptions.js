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

export const POST_LIKES_UPDATES = gql`
  subscription postLikesUpdates($postId: ID!) {
    postLikeUpdates(postId: $postId) {
      isLike
      userId
    }
  }
`;
export const COMMENT_LIKES_UPDATES = gql`
  subscription commentLikesUpdates($postId: ID!) {
    commentLikesUpdates(postId: $postId) {
      isLike
      userId
      postId
      commentId
    }
  }
`;
