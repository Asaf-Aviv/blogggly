import gql from 'graphql-tag';

export const SEND_MESSAGE = gql`
  mutation sendMessage($to: ID!, $body: String!) {
    sendMessage(to: $to, body: $body) {
      _id
      body
      createdAt
      read
      inBookmarks
      inTrash
      from {
        ...userSummary
      }
      to {
        ...userSummary
      }
    }
  }

  fragment userSummary on User {
    _id
    username
    avatar
  }
`;

export const BOOKMARK_MESSAGE = gql`
  mutation bookmarkMessage($messageId: ID!) {
    bookmarkMessage(messageId: $messageId) {
      _id
      read
      createdAt
      body
      inBookmarks
      inTrash
      from {
        ...userSummary
      }
      to {
        ...userSummary
      }
    }
  }

  fragment userSummary on User {
    _id
    username
    avatar
  }
`;

export const MOVE_MESSAGE_TO_TRASH = gql`
  mutation moveMessageToTrash($messageId: ID!) {
    moveMessageToTrash(messageId: $messageId) {
      _id
      read
      createdAt
      body
      inBookmarks
      inTrash
      from {
        ...userSummary
      }
      to {
        ...userSummary
      }
    }
  }

  fragment userSummary on User {
    _id
    username
    avatar
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($messageId: ID!) {
    deletedMessageId: deleteMessage(messageId: $messageId)
  }
`;
