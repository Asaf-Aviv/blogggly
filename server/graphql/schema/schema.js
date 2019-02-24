const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    relog: Relog
    user(id: ID): User
    searchUser(username: String): SearchUser
    users: [User!]!
    post(postId: ID): Post
    posts: [Post!]!
    userPosts(id: ID): [Post!]!
    postComments(postId: ID): [Comment!]!
  }

  type Mutation {
    login(email: String, password: String): Auth
    signup(userInput: UserInput): Auth
    createPost(postInput: PostInput): Post
    createComment(comment: CommentInput): Comment
    updatePost(postId: ID, updatedPost: PostInput): Post
    deletePost(id: ID): Post
    toggleLike(postId: ID, userId: ID): Likes
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
    updatedAt: String!
  }

  input CommentInput {
    author: ID!
    post: ID!
    body: String!
  }

  type SearchUser {
    user: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [String!]!
    avatar: String!
    createdAt: String!
    updatedAt: String!
    comments: [ID!]!
  }

  type Post {
    _id: ID!
    author: User!
    title: String!
    body: String!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
    likeCount: Int!
    likes: [ID!]
  }

  input PostInput {
    author: ID!
    title: String!
    body: String!
  }

  input UserInput {
    username: String
    email: String!
    password: String!
  }
`;
