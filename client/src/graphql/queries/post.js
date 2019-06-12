import gql from 'graphql-tag';

const authorShortSummary = `
  author {
    _id
    username
    avatar
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
      ${authorShortSummary}
    }
  }
`;

export const GET_FEATURED_POSTS = gql`
  query {
    posts: featuredPosts {
      _id
      title
      tags
      createdAt
      likesCount
      commentsCount
      ${authorShortSummary}
    }
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
      ${authorShortSummary}
    }
  }
`;

export const SEARCH_POSTS = gql`
  query searchPosts($postQuery: String!) {
    posts: searchPosts(postQuery: $postQuery) {
      _id
      title
      ${authorShortSummary}
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
      ${authorShortSummary}
    }
  }
`;
