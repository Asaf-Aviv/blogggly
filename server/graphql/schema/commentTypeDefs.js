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
    theyCommentOnMyPost: TheyCommentOnMyPost!
    theyLikeMyComment: TheyLikeMyComment!
    deletedPostComment(postId: ID!): ID!
  }

  type TheyCommentOnMyPost {
    commentAuthor: User!
    notification: Notification!
  }

  type TheyLikeMyComment {
    user: User!
    notification: Notification!
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
