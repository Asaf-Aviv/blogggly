const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    user(id: ID): User
    users: [User!]!
    getUserByUsername(username: String): User!
    getUsersByIds(userIds: [ID]): [User!]!
    searchUsers(userQuery: String!): [User!]!
  }

  type Mutation {
    relog: CurrentUser
    login(email: String, password: String): CurrentUser
    signup(userInput: UserInput): CurrentUser
    updateUserInfo(info: UserInfoInput): CurrentUser
    toggleFollow(userId: ID): CurrentUser
    sendFriendRequest(userId: ID!): ID
    acceptFriendRequest(userId: ID!): ID
    declineFriendRequest(userId: ID!): Boolean
    cancelFriendRequest(userId: ID!): Boolean
    removeFriend(userId: ID!): Boolean
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

  type UserLikes {
    comments: [String!]!
    posts: [String!]!
  }

  type Inbox {
    inbox: [Message!]!
    sent: [Message!]!
  }

  input UserInput {
    email: String!
    password: String!
    username: String!
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
