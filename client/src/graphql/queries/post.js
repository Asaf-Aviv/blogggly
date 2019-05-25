import gql from 'graphql-tag';

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
