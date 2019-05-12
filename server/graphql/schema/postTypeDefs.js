const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    post(postId: ID): Post!
    getPostsByIds(postIds: [ID]): [Post!]!
    postsByTag(tag: String): [Post!]!
    userPosts(id: ID): [Post!]!
    moreFromAuthor(authorId: ID, viewingPostId: ID): [Post!]!
    searchPosts(postQuery: String!): [Post!]!
  }

  type Mutation {
    createPost(postInput: PostInput): Post!
    updatePost(postId: ID, updatedPost: PostInput): Post!
    deletePost(postId: ID): String!
  }

  type Post {
    _id: ID!
    author: User!
    body: String!
    comments: [ID!]!
    commentsCount: Int!
    createdAt: String!
    likes: [ID!]!
    likesCount: Int!
    shortBody: String!
    tags: [String!]!
    title: String!
    updatedAt: String!
  }

  input PostInput {
    body: String!
    tags: [String!]!
    title: String!
  }
`;
