import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { string } from 'prop-types';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import { UIErrorNotifier } from '../../utils';

import './AddComment.sass';

const AddComment = ({ postId }) => {
  const [commentBody, setCommentBody] = useState('');

  const { loggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.ADD_COMMENT}
      variables={{
        comment: {
          post: postId,
          author: loggedUser && loggedUser._id,
          body: commentBody,
        },
      }}
      onCompleted={() => setCommentBody('')}
      refetchQueries={[{ query: queries.COMMENTS, variables: { postId } }]}
      onError={UIErrorNotifier}
    >
      {(addComment, { loading }) => (
        <form className="add-comment">
          <textarea
            className="add-comment__textarea"
            onChange={e => setCommentBody(e.target.value)}
            value={commentBody}
            required
            rows="5"
            placeholder="Add a Comment..."
          />
          <button
            className="btn btn--primary add-comment__btn"
            type="submit"
            onClick={loading ? null : (e) => {
              e.preventDefault();
              addComment();
            }}
          >
              Add Comment
          </button>
        </form>
      )}
    </Mutation>
  );
};

AddComment.propTypes = {
  postId: string.isRequired,
};

export default AddComment;
