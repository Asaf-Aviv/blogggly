import gql from 'graphql-tag';

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($userId: ID!) {
    sendFriendRequest(userId: $userId)
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

export const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!) {
    removeFriend(userId: $userId)
  }
`;

export const ACCEPT_ALL_FRIEND_REQUESTS = gql`
  mutation acceptAllFriendRequests($userIds: [ID!]!) {
    acceptAllFriendRequests(userIds: $userIds)
  }
`;

export const DECLINE_ALL_FRIEND_REQUESTS = gql`
  mutation declineAllFriendRequests($userIds: [ID!]!) {
    declineAllFriendRequests(userIds: $userIds)
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

export const READ_NOTIFICATION = gql`
  mutation readNotification($notificationId: ID!) {
    readNotification(notificationId: $notificationId)
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation deleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId)
  }
`;

export const READ_ALL_NOTIFICATIONS = gql`
  mutation readAllNotifications($unreadNotificationsIds: [ID!]!) {
    readAllNotifications(unreadNotificationsIds: $unreadNotificationsIds)
  }
`;

export const DELETE_ALL_NOTIFICATIONS = gql`
  mutation {
    deleteAllNotifications
  }
`;

export const REPORT = gql`
  mutation report($report: ReportInput!) {
    report(report: $report)
  }
`;
