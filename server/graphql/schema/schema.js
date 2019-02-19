const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    relog: Relog
    user(id: ID): User
    users: [User!]!
    post(id: ID): Post
    posts: [Post!]!
    postComments(postId: ID): [Comment!]!
  }

  type Mutation {
    login(email: String, password: String): Auth
    signup(userInput: UserInput): Auth
    createPost(postInput: PostInput): Post
    createComment(comment: CommentInput): Comment
    updatePost(postId: ID, updatedPost: PostInput): Post
    deletePost(id: ID): Post
  }

  type Relog {
    user: User!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Comment {
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

  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [String!]!
    avatar: String!
    createdAt: String!
    updatedAt: String!
    comments: [String!]!
  }

  type Post {
    _id: ID!
    author: User!
    title: String!
    body: String!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
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
