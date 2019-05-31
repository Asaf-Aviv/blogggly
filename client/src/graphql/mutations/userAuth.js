import gql from 'graphql-tag';

export const RELOG = gql`
  mutation {
    relog {
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      followers
      following
      friends
      notifications {
        _id
        body
        isRead
        createdAt
        from {
          _id
          avatar
          username
        }
      }
      incomingFriendRequests
      sentFriendRequests
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        bio
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        inbox {
          ...messageFields
        }
        sent {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    createdAt
    body
    read
    inBookmarks
    inTrash
    from {
      _id
      username
      avatar
    }
    to {
      _id
      username
      avatar
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      friends
      notifications {
        _id
        body
        isRead
        createdAt
        from {
          _id
          avatar
          username
        }
      }
      incomingFriendRequests
      sentFriendRequests
      followers
      following
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        bio
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        inbox {
          ...messageFields
        }
        sent {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    createdAt
    body
    read
    inBookmarks
    inTrash
    from {
      _id
      username
      avatar
    }
    to {
      _id
      username
      avatar
    }
  }
`;

export const SIGNUP = gql`
  mutation signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
      token
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      friends
      notifications {
        _id
        body
        isRead
        createdAt
        from {
          _id
          avatar
          username
        }
      }
      incomingFriendRequests
      sentFriendRequests
      followers
      following
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        bio
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        inbox {
          ...messageFields
        }
        sent {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    createdAt
    body
    read
    inBookmarks
    inTrash
    from {
      _id
      username
      avatar
    }
    to {
      _id
      username
      avatar
    }
  }
`;
