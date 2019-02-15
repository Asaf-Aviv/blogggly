const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
    postComments(postId: ID!): [Comment!]!
  }

  type Mutation {
    login(user: UserInput!): JWT
    createUser(user: UserInput!): User
    createPost(post: PostInput!): Post
    createComment(comment: CommentInput!): Comment
    updatePost(postId: ID!, updatedPost: PostInput!): Post
    deletePost(id: ID!): Post
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

  type JWT {
    token: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [Post!]!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
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
    email: String!
    password: String!
    username: String
  }
`;
