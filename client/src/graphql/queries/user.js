
import gql from 'graphql-tag';

export const SEARCH_USERS = gql`
  query searchUsers($userQuery: String!) {
    users: searchUsers(userQuery: $userQuery) {
      _id
      username
      avatar
      createdAt
      followersCount
      followingCount
      info {
        firstname
        lastname
        bio
        country
      }
    }
  }
`;

export const GET_SHORT_USERS_SUMMARY_BY_IDS = gql`
  query getUsersByIds($userIds: [ID!]!) {
    users: getUsersByIds(userIds: $userIds) {
      _id
      username
      avatar
    }
  }
`;

export const GET_USERS_BY_IDS = gql`
  query getUsersByIds($userIds: [ID!]!) {
    users: getUsersByIds(userIds: $userIds) {
      _id
      username
      avatar
      createdAt
      followersCount
      followingCount
      info {
        firstname
        lastname
        bio
        country
      }
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query getUserByUsername($username: String!) {
    user: getUserByUsername(username: $username) {
      _id
      username
      avatar
      createdAt
    }
  }
`;

export const GET_USER_LIKES = gql`
  query getUserLikes($postIds: [ID!]!, $commentIds: [ID!]!) {
    posts: getPostsByIds(postIds: $postIds) {
      _id
      title
      likes
      likesCount
      author {
        ...userDetails
      }
    }
    comments: getCommentsByIds(commentIds: $commentIds) {
      _id
      body
      likes
      likesCount
      post {
        _id
        title
        author {
          ...userDetails
        }
      }
      author {
        ...userDetails
      }
    }
  }

  fragment userDetails on User {
    _id
    username
    avatar
  }
`;

export const MORE_FROM_AUTHOR = gql`
  query moreFromAuthor($authorId: ID!, $viewingPostId: ID!) {
    moreFromAuthor(authorId: $authorId, viewingPostId: $viewingPostId) {
      _id
      title
      likesCount
      commentsCount
      tags
    }
  }
`;
