import gql from 'graphql-tag';

export const TOGGLE_LIKE = gql`
  mutation toggleLike($id: ID, $userId: ID, $isPost: Boolean) {
    toggleLike(id: $id, userId: $userId, isPost: $isPost) {
      ... on Post {
        _id
        likesCount
        likes
      }
      ... on Comment {
        _id
        likesCount
        likes
      }
    }
  }
`;

export const TOGGLE_FOLLOW = gql`
  mutation toggleFollow($userIdToFollow: ID) {
    toggleFollow(userIdToFollow: $userIdToFollow) {
      _id
      following
      followingCount
    }
  }
`;

export const GET_POSTS_BY_IDS = gql`
  query getPostsByIds($postIds: [ID]) {
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

export const GET_COMMENTS_BY_IDS = gql`
  query getCommentsByIds($commentIds: [ID]) {
    comments: getCommentsByIds(commentIds: $commentIds) {
      _id
    }
  }
`;

export const GET_USERS_BY_IDS = gql`
  query getUsersByIds($userIds: [ID]) {
    users: getUsersByIds(userIds: $userIds) {
      _id
      username
      avatar
    }
  }
`;

export const GET_USER_LIKES = gql`
  query getUserLikes($postIds: [ID], $commentIds: [ID]) {
    posts: getPostsByIds(postIds: $postIds) {
      _id
    }
    comments: getCommentsByIds(commentIds: $commentIds) {
      _id
    }
  }
`;

export const SEARCH_USER = gql`
  query searchUser($username: String) {
    searchUser(username: $username) {
      user {
        _id
        username
        email
      }
    }
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo($info: UserInfoInput) {
    updateUserInfo(info: $info) {
      _id
      info {
        firstname
        lastname
        country
        gender
        dateOfBirth
      }
    }
  }
`;

export const GET_POSTS_BY_TAGS = gql`
  query postsByTags($tags: [String]) {
    posts: postsByTags(tags: $tags) {
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
  query userPosts($id: ID) {
    posts: userPosts(id: $id) {
      _id
      title
      body
      createdAt
    }
  }
`;

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
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        sent {
          ...messageFields
        }
        inbox {
          ...messageFields
        }
        bookmarks {
          ...messageFields
        }
        trash {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    from
    to
    body
    read
    createdAt
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
      followers
      following
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        sent {
          ...messageFields
        }
        inbox {
          ...messageFields
        }
        bookmarks {
          ...messageFields
        }
        trash {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    from
    to
    body
    read
    createdAt
  }
`;

export const SIGNUP = gql`
  mutation signup($userInput: UserInput) {
    signup(userInput: $userInput) {
      token
      _id
      username
      email
      posts
      avatar
      createdAt
      comments
      followers
      following
      followersCount
      followingCount
      tags
      info {
        firstname
        lastname
        gender
        dateOfBirth
        country
      }
      likes {
        posts
        comments
      }
      inbox {
        sent {
          ...messageFields
        }
        inbox {
          ...messageFields
        }
        bookmarks {
          ...messageFields
        }
        trash {
          ...messageFields
        }
      }
    }
  }

  fragment messageFields on Message {
    _id
    from
    to
    body
    read
    createdAt
  }
`;

export const CREATE_POST = gql`
  mutation createPost($postInput: PostInput) {
    createPost(postInput: $postInput) {
      _id
      title
      body
    }
  }
`;

export const MORE_FROM_AUTHOR = gql`
  query moreFromAuthor($authorId: ID, $viewingPostId: ID) {
    moreFromAuthor(authorId: $authorId, viewingPostId: $viewingPostId) {
      _id
      title
      likesCount
      commentsCount
      tags
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

export const POST = gql`
  query post($postId: ID, $withComments: Boolean = false) {
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
        ...userDetails
      }
      comments @include(if: $withComments) {
        _id
        body
        createdAt
        likesCount
        likes
        author {
          ...userDetails
        }
      }
    }
  }

  fragment userDetails on User {
    _id
    username
    avatar
  }
`;

export const ALL_USERS = gql`
  query {
    users {
      username
      avatar
    }
  }
`;

export const POSTS = gql`
  query {
    posts {
      _id
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($comment: CommentInput) {
    addComment(comment: $comment) {
      _id
      comments {
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
  }
`;
