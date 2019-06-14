const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getUserByUsername(username: String!): User
    getUsersByIds(userIds: [ID!]!): [User]!
    searchUsers(userQuery: String!): [User!]!
    validateResetToken(resetToken: String!): String!
  }

  type Mutation {
    relog: CurrentUser!
    login(email: String!, password: String!): CurrentUser!
    signup(signupInput: SignupInput!): CurrentUser!
    updateUserInfo(info: UserInfoInput!): CurrentUser!
    toggleFollow(userId: ID!): ToggleFollow!
    forgotPassword(email: String!): Boolean!
    resetPassword(email: String!, password: String!, confirmPassword: String!): Boolean!
    sendFriendRequest(userId: ID!): ID!
    acceptFriendRequest(userId: ID!): ID!
    acceptAllFriendRequests(userIds: [ID!]!): Boolean!
    declineAllFriendRequests(userIds: [ID!]!): Boolean!
    declineFriendRequest(userId: ID!): Boolean!
    cancelFriendRequest(userId: ID!): Boolean!
    removeFriend(userId: ID!): Boolean!
    readNotification(notificationId: ID!): Boolean!
    readAllNotifications(unreadNotificationsIds: [ID!]!): Boolean!
    deleteNotification(notificationId: ID!): Boolean!
    deleteAllNotifications: Boolean!
  }

  type Subscription {
    newFriendRequest: NewFriendRequest!
    followersUpdates: FollowerUpdate!
    acceptedFriendRequest: AcceptedFriendRequest!
    declinedFriendRequest: ID!
    canceledFriendRequest: ID!
    deleteFriend: ID!
  }

  type NewFriendRequest {
    user: User!
    notification: Notification!
  }

  type AcceptedFriendRequest {
    user: User!
    notification: Notification!
  }

  type FollowerUpdate {
    follower: User!
    isFollow: Boolean!
    notification: Notification
  }

  type ToggleFollow {
    followee: User!
    isFollow: Boolean!
  }

  type CurrentUser {
    token: String
    _id: ID!
    avatar: String!
    comments: [ID!]!
    createdAt: String!
    email: String!
    followers: [ID!]!
    followersCount: Int!
    following: [ID!]!
    followingCount: Int!
    sentFriendRequests: [ID!]!
    incomingFriendRequests: [ID!]!
    friends: [ID!]!
    notifications: [Notification!]!
    inbox: Inbox!
    info: UserInfo!
    likes: UserLikes!
    posts: [String!]!
    tags: [String!]!
    username: String!
  }

  type User {
    _id: ID!
    avatar: String!
    comments: [ID!]!
    createdAt: String!
    email: String!
    followers: [ID!]!
    followersCount: Int!
    following: [ID!]!
    followingCount: Int!
    friends: [User!]!
    info: UserInfo!
    likes: UserLikes!
    posts: [String!]!
    tags: [String!]!
    username: String!
  }

  type UserInfo {
    firstname: String!
    lastname: String!
    bio: String!
    gender: String!
    country: String!
    dateOfBirth: String
  }

  type Notification {
    _id: ID!
    body: String!
    isRead: Boolean!
    createdAt: String!
    from: User
  }

  type Message {
    _id: ID!
    body: String!
    createdAt: String!
    to: User!
    from: User!
    read: Boolean!
    inBookmarks: Boolean!
    inTrash: Boolean!
  }

  type UserLikes {
    comments: [String!]!
    posts: [String!]!
  }

  type Inbox {
    inbox: [Message!]!
    sent: [Message!]!
  }

  input UserCredentialsInput {
    email: String!
    password: String!
    username: String!
  }

  input SignupInput {
    credentials: UserCredentialsInput!
    recaptcha: String
  }

  input UserInfoInput {
    firstname: String
    lastname: String
    bio: String
    gender: String
    country: String
    dateOfBirth: String
  }
`;
