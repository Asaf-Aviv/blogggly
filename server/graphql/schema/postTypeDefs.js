const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    post(postId: ID!): Post!
    getPostsByIds(postIds: [ID!]!): [Post!]!
    postsByTag(tag: String!): [Post!]!
    moreFromAuthor(authorId: ID!, viewingPostId: ID!): [Post!]!
    searchPosts(postQuery: String!): [Post!]!
  }

  type Mutation {
    createPost(postInput: PostInput!): Post!
    updatePost(postId: ID!, updatedPost: PostInput!): Post!
    deletePost(postId: ID!): String!
    toggleLikeOnPost(postId: ID!): Post!
  }

  type Subscription {
    postLikesUpdates(postId: ID!): Post!
    theyLikeMyPost: User!
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

  input PostInput {
    body: String!
    tags: [String!]!
    title: String!
  }
`;
