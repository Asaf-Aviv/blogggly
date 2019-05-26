const { gql } = require('apollo-server-express');

module.exports = gql`
  type Mutation {
    sendMessage(to: ID!, body: String!): Message!
    bookmarkMessage(messageId: ID!, inInbox: Boolean!): Message!
    moveMessageToTrash(messageId: ID!, inInbox: Boolean!): Message!
    deleteMessage(messageId: ID!, inInbox: Boolean!): ID!
  }

  type Subscription {
    newMessage: Message!
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
