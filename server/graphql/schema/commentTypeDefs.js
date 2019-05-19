const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getCommentsByIds(commentIds: [ID]): [Comment!]!
    postComments(postId: ID!, sortBy: SortCommentsBy!): [Comment!]!
  }
  
  type Mutation {
    addComment(comment: CommentInput): Comment!
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

  enum SortCommentsBy {
    DATE_ASC
    DATE_DESC
    LIKES
  }

  input CommentInput {
    body: String!
    post: ID!
  }
`;
