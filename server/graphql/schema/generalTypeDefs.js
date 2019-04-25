const { gql } = require('apollo-server-express');

module.exports = gql`
  type Mutation {
    toggleLike(id: ID, isPost: Boolean): ToggleLikeResult
  }

  union ToggleLikeResult = Post | Comment

  type Message {
    _id: ID!
    body: String!
    createdAt: String!
    to: User!
    from: User!
    read: Boolean!
    inBookmarks: Boolean!
    inTrash: Boolean!
  }

  type Likes {
    likes: [ID!]!
  }
`;
