const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    user(id: ID): User
    users: [User!]!
    getUsersByIds(userIds: [ID]): [User!]!
    searchUser(username: String): SearchUser
    post(postId: ID): Post
    posts: [Post!]!
    getPostsByIds(postIds: [ID]): [Post!]!
    getCommentsByIds(commentIds: [ID]): [Comment!]!
    postsByTags(tags: [String]): [Post!]!
    userPosts(id: ID): [Post!]!
    postComments(postId: ID): [Comment!]!
    moreFromAuthor(authorId: ID, viewingPostId: ID): [Post!]!
    inbox: Inbox
  }

  type Mutation {
    relog: CurrentUser
    login(email: String, password: String): CurrentUser
    signup(userInput: UserInput): CurrentUser
    updateUserInfo(info: UserInfoInput): CurrentUser
    createPost(postInput: PostInput): Post
    addComment(comment: CommentInput): Post
    updatePost(postId: ID, updatedPost: PostInput): Post
    deletePost(id: ID): Post
    toggleLike(id: ID, userId: ID, isPost: Boolean): ToggleLikeResult
    sendMessage(to: ID, body: String): Message
    toggleFollow(userIdToFollow: ID): CurrentUser
  }

  union ToggleLikeResult = Post | Comment

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
    inbox: Inbox!
    info: UserInfo!
    likes: UserLikes!
    posts: [String!]!
    tags: [String!]!
    username: String!
  }

  type UserInfo {
    firstname: String
    lastname: String
    gender: String
    country: String
    dateOfBirth: String
  }

  input UserInfoInput {
    country: String
    dateOfBirth: String
    firstname: String
    gender: String
    lastname: String
  }

  type UserLikes {
    comments: [String!]!
    posts: [String!]!
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
    info: UserInfo!
    likes: UserLikes!
    posts: [String!]!
    tags: [String!]!
    username: String!
  }

  type Message {
    _id: ID!
    body: String!
    createdAt: String!
    from: ID!
    read: Boolean!
    to: ID!
  }

  type Inbox {
    bookmarks: [Message!]!
    inbox: [Message!]!
    sent: [Message!]!
    trash: [Message!]!
  }

  type Relog {
    user: User!
  }

  type Likes {
    likes: [ID!]!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Comment {
    _id: ID!
    author: User!
    body: String!
    createdAt: String!
    likes: [ID!]!
    likesCount: Int!
    post: Post!
  }

  type SearchUser {
    user: User
  }

  type Post {
    _id: ID!
    author: User!
    body: String!
    comments: [Comment!]!
    commentsCount: Int!
    createdAt: String!
    likes: [ID!]!
    likesCount: Int!
    shortBody: String!
    tags: [String!]!
    title: String!
    updatedAt: String!
  }

  input CommentInput {
    body: String!
    post: ID!
  }

  input PostInput {
    author: ID!
    body: String!
    tags: [String!]!
    title: String!
  }

  input UserInput {
    email: String!
    password: String!
    username: String!
  }
`;
