import gql from 'graphql-tag';

export const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $body: String!) {
    newComment: addComment(postId: $postId, body: $body) {
      _id
      author {
        _id
        username
        avatar
      }
      body
      createdAt
      likes
      likesCount
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      _id
      title
      body
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($to: ID!, $body: String!) {
    sendMessage(to: $to, body: $body) {
      _id
      body
      createdAt
      read
      inBookmarks
      inTrash
      from {
        ...userSummary
      }
      to {
        ...userSummary
      }
    }
  }

  fragment userSummary on User {
    _id
    username
    avatar
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($userId: ID!) {
    sendFriendRequest(userId: $userId)
  }
`;

export const REPORT = gql`
  mutation report($report: ReportInput!) {
    report(report: $report)
  }
`;

export const TOGGLE_FOLLOW = gql`
  mutation toggleFollow($userId: ID!) {
    toggleFollow(userId: $userId) {
      followee {
        _id
        followers
        followersCount
      }
      isFollow
    }
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

export const TOGGLE_LIKE_ON_COMMENT = gql`
  mutation toggleLikeOnComment($commentId: ID!) {
    toggleLikeOnComment(commentId: $commentId) {
      _id
      likesCount
      likes
    }
  }
`;


export const BOOKMARK_MESSAGE = gql`
  mutation bookmarkMessage($messageId: ID!) {
    bookmarkMessage(messageId: $messageId) {
      _id
      read
      createdAt
      body
      inBookmarks
      inTrash
      from {
        ...userSummary
      }
      to {
        ...userSummary
      }
    }
  }

  fragment userSummary on User {
    _id
    username
    avatar
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($messageId: ID!) {
    deletedMessageId: deleteMessage(messageId: $messageId)
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(commentId: $commentId, postId: $postId)
  }
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!) {
    removeFriend(userId: $userId)
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendRequest($userId: ID!) {
    acceptFriendRequest(userId: $userId)
  }
`;

export const DECLINE_FRIEND_REQUEST = gql`
  mutation declineFriendRequest($userId: ID!) {
    declineFriendRequest(userId: $userId)
  }
`;

export const CANCEL_FRIEND_REQUEST = gql`
  mutation cancelFriendRequest($userId: ID!) {
    cancelFriendRequest(userId: $userId)
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo($info: UserInfoInput!) {
    updateUserInfo(info: $info) {
      _id
      info {
        firstname
        lastname
        country
        gender
        dateOfBirth
      }
    }
  }
`;

export const MOVE_MESSAGE_TO_TRASH = gql`
  mutation moveMessageToTrash($messageId: ID!) {
    moveMessageToTrash(messageId: $messageId) {
      _id
      read
      createdAt
      body
      inBookmarks
      inTrash
      from {
        ...userSummary
      }
      to {
        ...userSummary
      }
    }
  }

  fragment userSummary on User {
    _id
    username
    avatar
  }
`;


export const RELOG = gql`
  mutation {
    relog {
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      followers
      following
      friends
      incomingFriendRequests
      sentFriendRequests
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        bio
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        inbox {
          ...messageFields
        }
        sent {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    createdAt
    body
    read
    inBookmarks
    inTrash
    from {
      _id
      username
      avatar
    }
    to {
      _id
      username
      avatar
    }
  }
`;


export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      friends
      incomingFriendRequests
      sentFriendRequests
      followers
      following
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        bio
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        inbox {
          ...messageFields
        }
        sent {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    createdAt
    body
    read
    inBookmarks
    inTrash
    from {
      _id
      username
      avatar
    }
    to {
      _id
      username
      avatar
    }
  }
`;

export const SIGNUP = gql`
  mutation signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
      token
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      friends
      incomingFriendRequests
      sentFriendRequests
      followers
      following
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        bio
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        inbox {
          ...messageFields
        }
        sent {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    createdAt
    body
    read
    inBookmarks
    inTrash
    from {
      _id
      username
      avatar
    }
    to {
      _id
      username
      avatar
    }
  }
`;
