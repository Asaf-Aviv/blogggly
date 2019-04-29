import React, { useState, useContext, useEffect } from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  arrayOf, string, number, shape, func, bool,
} from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserShortSummaryPropTypes } from '../../propTypes';
import Likes from '../Likes';
import DeleteCommentButton from '../DeleteCommentButton';
import { UserContext } from '../../context';

import './UserProfileComment.sass';

const UserProfileComment = ({
  comment, comment: { post }, isDeleted, addToDeletionQueue,
}) => (
  <li className={`user-profile-comment__container ${isDeleted ? 'deleted' : ''}`}>
    <Link to={`/post/${post._id}`}>
      <h4 className="user-profile-comment__post-title">
        {`on ${post.author.username} post ${post.title}`}
      </h4>
    </Link>
    <p className="user-profile-comment__comment-body">{comment.body}</p>
    <div className="likes__wrapper">
      <Likes
        id={comment._id}
        likesCount={comment.likesCount}
        likes={comment.likes}
      />
      <DeleteCommentButton
        commentId={comment._id}
        postId={post._id}
        onCompletedCb={addToDeletionQueue}
      />
    </div>
  </li>
);

UserProfileComment.propTypes = {
  comment: shape({
    _id: string.isRequired,
    body: string.isRequired,
    createdAt: string.isRequired,
    likes: arrayOf(string).isRequired,
    likesCount: number.isRequired,
    post: shape({
      _id: string.isRequired,
      title: string.isRequired,
      author: UserShortSummaryPropTypes.isRequired,
    }).isRequired,
  }).isRequired,
  isDeleted: bool.isRequired,
  addToDeletionQueue: func.isRequired,
};

let cacheDeletedComments = [];

const UserProfileComments = ({ commentIds }) => {
  const [deletedCommentsIds, setDeletedCommentsIds] = useState([]);

  const { loggedUser, setLoggedUser } = useContext(UserContext);

  const addToDeletionQueue = (commentId) => {
    setDeletedCommentsIds([...deletedCommentsIds, commentId]);
  };

  useEffect(() => {
    if (deletedCommentsIds.length) {
      cacheDeletedComments = [...deletedCommentsIds];
    }
  }, [deletedCommentsIds]);

  useEffect(() => () => {
    const updatedComments = loggedUser.comments
      .filter(commentId => !cacheDeletedComments.includes(commentId));

    setLoggedUser({
      ...loggedUser,
      comments: updatedComments,
      likes: {
        ...loggedUser.likes,
        comments: loggedUser.likes.comments
          .filter(commentId => !cacheDeletedComments.includes(commentId)),
      },
    });
  }, []);

  return (
    <Query
      query={queries.GET_COMMENTS_BY_IDS}
      onError={utils.UIErrorNotifier}
      variables={{ commentIds, withPostInfo: true }}
    >
      {({ data, loading }) => {
        if (loading) return null;

        return (
          <div className="user-profile__comments-container">
            <ul>
              {data.comments.map(comment => (
                <UserProfileComment
                  key={comment._id}
                  comment={comment}
                  isDeleted={deletedCommentsIds.includes(comment._id)}
                  addToDeletionQueue={addToDeletionQueue}
                />
              ))}
            </ul>
          </div>
        );
      }}
    </Query>
  );
};


UserProfileComments.propTypes = {
  commentIds: arrayOf(string).isRequired,
};

export default UserProfileComments;
