const { gql } = require('apollo-server-express');

module.exports = gql`
  type Mutation {
    sendMessage(to: ID, body: String): Message
    bookmarkMessage(messageId: ID): Message
    moveMessageToTrash(messageId: ID): Message
    deleteMessage(messageId: ID): ID
  }

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
`;
