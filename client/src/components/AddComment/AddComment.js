import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Loader from '../Loader';
import { UserContext, MemberFormsContext } from '../../context';

import './AddComment.sass';

const AddComment = ({ postId }) => {
  const [commentBody, setCommentBody] = useState('');

  const { setLoggedUser, isLogged } = useContext(UserContext);
  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

  return (
    <Mutation
      mutation={queries.ADD_COMMENT}
      variables={{
        comment: {
          post: postId,
          body: commentBody,
        },
      }}
      update={(proxy, { data: { newComment } }) => {
        const query = {
          query: queries.POST_COMMENTS,
          variables: { postId },
        };
        const data = proxy.readQuery(query);
        data.comments.push(newComment);
        proxy.writeQuery({ ...query, data });
      }}
      onCompleted={({ newComment }) => {
        setCommentBody('');
        setLoggedUser((draft) => {
          draft.comments.unshift(newComment._id);
        });
      }}
      onError={utils.UIErrorNotifier}
    >
      {(addComment, { loading }) => (
        <form
          className="add-comment"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLogged) {
              Alert.info('Please login or signup to comment.');
              setShowLogin(true);
              setShowMemberForms(true);
              return;
            }
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
