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

export const DELETE_FRIEND = gql`
  subscription {
    deletedFriendId: deleteFriend
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
