const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getCommentsByIds(commentIds: [ID!]!): [Comment]!
    postComments(postId: ID!): [Comment!]!
  }
  
  type Mutation {
    newComment(postId: ID!, body: String!): Comment!
    deleteComment(commentId: ID!, postId: ID!): ID!
    toggleLikeOnComment(commentId: ID!): Comment!
  }

  type Subscription {
    newPostComment(postId: ID!): Comment!
    commentLikesUpdates(postId: ID!): Comment!
    theyCommentOnMyPost: User!
    theyLikeMyComment: User!
    deletedPostComment(postId: ID!): ID!
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
`;
