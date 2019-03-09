import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Loader from '../Loader';

import './AddComment.sass';
import { UserContext } from '../../context';

const AddComment = ({ postId }) => {
  const [commentBody, setCommentBody] = useState('');

  const { loggedUser, setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.ADD_COMMENT}
      variables={{
        comment: {
          post: postId,
          body: commentBody,
        },
      }}
      onCompleted={({ addComment: { comments } }) => {
        console.log(comments);
        setCommentBody('');
        setLoggedUser({
          ...loggedUser,
          comments: [
            comments[comments.length - 1]._id,
            ...loggedUser.comments,
          ],
        });
      }}
      onError={utils.UIErrorNotifier}
    >
      {(addComment, { loading }) => (
        <form
          className="add-comment"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loggedUser) return;
            addComment();
          }}
        >
          <textarea
            className="add-comment__textarea"
            onChange={e => setCommentBody(e.target.value)}
            value={commentBody}
            required
            rows="5"
            placeholder="Add a Comment"
          />
          <button
            className="btn btn--primary add-comment__btn"
            type="submit"
          >
            Add Comment
          </button>
          {loading && <Loader />}
        </form>
      )}
    </Mutation>
  );
};

AddComment.propTypes = {
  postId: string.isRequired,
};

export default AddComment;
