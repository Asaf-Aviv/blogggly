const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    relog: Relog
    user(id: ID): User
    searchUser(username: String): SearchUser
    users: [User!]!
    post(postId: ID): Post
    posts: [Post!]!
    userPosts(id: ID): [Post!]!
    postComments(postId: ID): [Comment!]!
    moreFromAuthor(authorId: ID, viewingPostId: ID): [Post!]!
    inbox: Inbox
  }

  type Mutation {
    login(email: String, password: String): Auth
    signup(userInput: UserInput): Auth
    createPost(postInput: PostInput): Post
    createComment(comment: CommentInput): Comment
    updatePost(postId: ID, updatedPost: PostInput): Post
    deletePost(id: ID): Post
    toggleLike(id: ID, userId: ID, isPost: Boolean): Likes
    sendMessage(to: ID, body: String): Message
  }

  type Message {
    _id: ID!
    from: ID!
    to: ID!
    body: String!
    read: Boolean!
    createdAt: String!
  }

  type Inbox {
    sent: [Message!]!
    inbox: [Message!]!
    bookmarks: [Message!]!
    trash: [Message!]!
  }

  type Relog {
    user: User!
  }

  type Likes {
    likes: [ID!]!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Comment {
    _id: ID!
    author: User!
    post: Post!
    body: String!
    createdAt: String!
    updatedAt: String!
    likeCount: Int!
    likes: [ID!]!
  }

  input CommentInput {
    author: ID!
    post: ID!
    body: String!
  }

  type SearchUser {
    user: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [String!]!
    avatar: String!
    createdAt: String!
    updatedAt: String!
    comments: [ID!]!
    inbox: Inbox!
  }

  type Post {
    _id: ID!
    author: User!
    title: String!
    body: String!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
    likeCount: Int!
    likes: [ID!]
  }

  input PostInput {
    author: ID!
    title: String!
    body: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
`;
