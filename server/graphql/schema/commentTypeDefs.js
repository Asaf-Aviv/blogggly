const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getCommentsByIds(commentIds: [ID]): [Comment!]!
  }
  
  type Mutation {
    addComment(comment: CommentInput): Post!
    deleteComment(commentId: ID, postId: ID): ID!
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
