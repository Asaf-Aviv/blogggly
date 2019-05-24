const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getCommentsByIds(commentIds: [ID]): [Comment!]!
    postComments(postId: ID!): [Comment!]!
  }
  
  type Mutation {
    addComment(comment: CommentInput): Comment!
    deleteComment(commentId: ID, postId: ID): ID!
    toggleLikeOnComment(commentId: ID!): Comment!
  }

  type Subscription {
    newPostComment(postId: ID!): Comment!
    commentLikesUpdates(postId: ID!): Comment!
    theyLikeMyComment: User!
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

  input CommentInput {
    body: String!
    post: ID!
  }
`;
