const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    user(id: ID): User
    searchUser(username: String): SearchUser
    users: [User!]!
    post(postId: ID): Post
    posts: [Post!]!
    userPosts(id: ID): [Post!]!
    postComments(postId: ID): [Comment!]!
    moreFromAuthor(authorId: ID, viewingPostId: ID): [Post!]!
    inbox: Inbox
  }

  type Mutation {
    relog: CurrentUser
    login(email: String, password: String): CurrentUser
    signup(userInput: UserInput): CurrentUser
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
    username: String!
    email: String!
    posts: [String!]!
    avatar: String!
    likes: UserLikes!
    createdAt: String!
    inbox: Inbox!
    comments: [ID!]!
    followers: [ID!]!
    following: [ID!]!
    followersCount: Int!
    followingCount: Int!
    tags: [String!]!
  }

  type UserLikes {
    posts: [String!]!
    comments: [String!]!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [String!]!
    avatar: String!
    createdAt: String!
    comments: [ID!]!
    likes: UserLikes!
    followers: [ID!]!
    following: [ID!]!
    followersCount: Int!
    followingCount: Int!
    tags: [String!]!
  }

  type Message {
    _id: ID!
    from: ID!
    to: ID!
    body: String!
    read: Boolean!
    createdAt: String!
  }

  type Inbox {
    sent: [Message!]!
    inbox: [Message!]!
    bookmarks: [Message!]!
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
    post: Post!
    body: String!
    createdAt: String!
    likeCount: Int!
    likes: [ID!]!
  }

  type SearchUser {
    user: User
  }

  type Post {
    _id: ID!
    author: User!
    title: String!
    shortBody: String!
    body: String!
    createdAt: String!
    updatedAt: String!
    commentsCount: Int!
    comments: [Comment!]!
    likeCount: Int!
    likes: [ID!]!
    tags: [String!]!
  }

  input CommentInput {
    post: ID!
    body: String!
  }

  input PostInput {
    author: ID!
    title: String!
    body: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
`;
