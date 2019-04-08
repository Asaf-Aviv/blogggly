import gql from 'graphql-tag';
import Inbox from '../../components/Inbox';

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
  mutation toggleFollow($userId: ID) {
    toggleFollow(userId: $userId) {
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

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID, $postId: ID) {
    deleteComment(commentId: $commentId, postId: $postId)
  }
`;

export const GET_COMMENTS_BY_IDS = gql`
  query getCommentsByIds(
    $commentIds: [ID],
    $withPostInfo: Boolean = false,
    $withAuthorInfo: Boolean = false
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
      author @include (if: $withAuthorInfo) {
        _id
        username
        avatar
      }
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
      info {
        bio
      }
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query getUserByUsername($username: String) {
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

export const GET_POSTS_BY_TAG = gql`
  query postsByTag($tag: String) {
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
  query userPosts($id: ID) {
    posts: userPosts(id: $id) {
      _id
      title
      body
      createdAt
    }
  }
`;

export const BOOKMARK_MESSAGE = gql`
  mutation bookmarkMessage($messageId: ID) {
    bookmarkMessage(messageId: $messageId) {
      _id
      read
      createdAt
      body
      inBookmarks
      inTrash
      from {
        ...userSummaryFields
      }
      to {
        ...userSummaryFields
      }
    }
  }

  fragment userSummaryFields on User {
    _id
    username
    avatar
  }
`;

export const MOVE_MESSAGE_TO_TRASH = gql`
  mutation moveMessageToTrash($messageId: ID) {
    moveMessageToTrash(messageId: $messageId) {
      _id
      read
      createdAt
      body
      inBookmarks
      inTrash
      from {
        ...userSummaryFields
      }
      to {
        ...userSummaryFields
      }
    }
  }

  fragment userSummaryFields on User {
    _id
    username
    avatar
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($to: ID, $body: String) {
    sendMessage(to: $to, body: $body) {
      _id
      body
      createdAt
      from {
        ...userSummaryFields
      }
      read
      inBookmarks
      inTrash
      to {
        ...userSummaryFields
      }
    }
  }

  fragment userSummaryFields on User {
    _id
    username
    avatar
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($messageId: ID) {
    deleteMessage(messageId: $messageId)
  }
`;

Inbox.fragments = {
  message: gql`
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
  `,
};

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
  ${Inbox.fragments.message}
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
