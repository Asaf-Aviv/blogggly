const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getCommentsByIds(commentIds: [ID]): [Comment!]!
    postComments(postId: ID!): [Comment!]!
  }
  
  type Mutation {
    addComment(comment: CommentInput): Comment!
    deleteComment(commentId: ID, postId: ID): ID!
  }

  type Subscription {
    newPostComment(postId: ID!): Comment!
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
