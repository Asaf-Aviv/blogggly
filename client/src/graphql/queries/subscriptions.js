import gql from 'graphql-tag';

export const NEW_FRIEND_REQUEST = gql`
  subscription {
    newFriendRequest {
      _id
      avatar
      username
    }
  }
`;

export const FOLLOWERS_UPDATES = gql`
  subscription {
    followersUpdates {
      follower {
        _id
        avatar
        username
      }
      isFollow
    }
  }
`;

export const ACCEPTED_FRIEND_REQUEST = gql`
  subscription {
    acceptedFriendRequest {
      _id
      avatar
      username
    }
  }
`;

export const DECLINED_FRIEND_REQUEST = gql`
  subscription {
    declinedFriendRequest
  }
`;

export const CANCELED_FRIEND_REQUEST = gql`
  subscription {
    canceledFriendRequest
  }
`;

export const THEY_LIKE_MY_COMMENT = gql`
  subscription {
    theyLikeMyComment {
      _id
      avatar
      username
    }
  }
`;

export const THEY_LIKE_MY_POST = gql`
  subscription {
    theyLikeMyPost {
      _id
      avatar
      username
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
    postLikesUpdates(postId: $postId) {
      _id
      likes
      likesCount
    }
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
