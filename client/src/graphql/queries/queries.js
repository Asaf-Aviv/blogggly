import gql from 'graphql-tag';

export const TOGGLE_LIKE = gql`
  mutation toggleLike($id: ID, $userId: ID, $isPost: Boolean) {
    toggleLike(id: $id, userId: $userId, isPost: $isPost) {
      ... on Post {
        _id
        likeCount
        likes
      }
      ... on Comment {
        _id
        likeCount
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

export const USER_POSTS = gql`
  query userPosts($id: ID) {
    userPosts(id: $id) {
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
      shortBody
      likeCount
    }
  }
`;

export const COMMENTS = gql`
  query postComments($postId: ID) {
    postComments(postId: $postId) {
      _id
      body
      createdAt
      likeCount
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
      likeCount
      likes
      author {
        ...userDetails
      }
      comments @include(if: $withComments) {
        _id
        body
        createdAt
        likeCount
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
        likeCount
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
