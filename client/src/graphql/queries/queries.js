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

export const SEARCH_POSTS = gql`
  query searchPosts($postQuery: String!) {
    posts: searchPosts(postQuery: $postQuery) {
      _id
      title
      author {
        _id
        avatar
        username
      }
    }
  }
`;

export const GET_POSTS_BY_IDS = gql`
  query getPostsByIds($postIds: [ID!]!) {
    posts: getPostsByIds(postIds: $postIds) {
      _id
      title
      likesCount
      commentsCount
      tags
      author {
        _id
        username
        avatar
      }
    }
  }
`;

export const COMMENTS = gql`
  query postComments($postId: ID) {
    postComments(postId: $postId) {
      _id
      body
      createdAt
      likesCount
      likes
      author {
        _id
        username
        avatar
      }
    }
  }
`;

export const GET_COMMENTS_BY_IDS = gql`
  query getCommentsByIds(
    $commentIds: [ID!]!,
    $withPostInfo: Boolean = false,
  ) {
    comments: getCommentsByIds(commentIds: $commentIds) {
      _id
      body
      createdAt
      likesCount
      likes
      post @include (if: $withPostInfo) {
        _id
        title
        author {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const POST_COMMENTS = gql`
  query postComments($postId: ID!) {
    comments: postComments(postId: $postId) {
      _id
      body
      createdAt
      likesCount
      likes
      author {
        _id
        username
        avatar
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
  query getUsersByIds($userIds: [ID]) {
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
  query getUserLikes($postIds: [ID], $commentIds: [ID]) {
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

export const GET_POSTS_BY_TAG = gql`
  query postsByTag($tag: String!) {
    posts: postsByTag(tag: $tag) {
      _id
      title
      tags
      createdAt
      likesCount
      commentsCount
      author {
        _id
        username
        avatar
      }
    }
  }
`;

export const USER_POSTS = gql`
  query userPosts($id: ID!) {
    posts: userPosts(id: $id) {
      _id
      title
      body
      createdAt
    }
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

export const POST = gql`
  query post($postId: ID!) {
    post(postId: $postId) {
      _id
      title
      body
      createdAt
      updatedAt
      tags
      commentsCount
      likesCount
      likes
      author {
        _id
        username
        avatar
      }
    }
  }
`;
