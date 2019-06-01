import gql from 'graphql-tag';

const userShortSummaryFields = `
  _id
  avatar
  username
`;

const notification = `
  notification {
    _id
    body
    from {
      ${userShortSummaryFields}
    }
    createdAt
    isRead
  }
`;

export const NEW_FRIEND_REQUEST = gql`
  subscription {
    newFriendRequest {
      user {
        ${userShortSummaryFields}
      }
      ${notification}
    }
  }
`;

export const ACCEPTED_FRIEND_REQUEST = gql`
  subscription {
    acceptedFriendRequest {
      user {
        ${userShortSummaryFields}
      }
      ${notification}
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
      isFollow
      follower {
        ${userShortSummaryFields}
      }
      ${notification}
    }
  }
`;

export const THEY_COMMENT_ON_MY_POST = gql`
  subscription {
    theyCommentOnMyPost {
      commentAuthor {
        ${userShortSummaryFields}
      }
      ${notification}
    }
  }
`;

export const THEY_LIKE_MY_COMMENT = gql`
  subscription {
    theyLikeMyComment {
      user {
        ${userShortSummaryFields}
      }
      ${notification}
    }
  }
`;

export const THEY_LIKE_MY_POST = gql`
  subscription {
    theyLikeMyPost {
      user {
        ${userShortSummaryFields}
      }
      ${notification}
    }
  }
`;

export const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      message {
        _id
        body
        createdAt
        read
        inBookmarks
        inTrash
        to {
          ${userShortSummaryFields}
        }
        from {
          ${userShortSummaryFields}
        }
      }
      ${notification}
    }
  }
`;
