import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { string } from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Loader from '../Loader';
import Button from '../Button';
import { UserContext, MemberFormsContext } from '../../context';

import './AddComment.sass';

const AddComment = ({ postId }) => {
  const [commentBody, setCommentBody] = useState('');

  const { setLoggedUser, isLogged } = useContext(UserContext);
  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

  return (
    <Mutation
      mutation={queries.ADD_COMMENT}
      variables={{ postId, body: commentBody }}
      update={(cache, { data: { newComment } }) => {
        const query = {
          query: queries.POST_COMMENTS,
          variables: { postId },
        };
        const data = cache.readQuery(query);
        data.comments.push(newComment);
        cache.writeQuery({ ...query, data });
      }}
      onCompleted={({ newComment }) => {
        setCommentBody('');
        setLoggedUser((draft) => {
          draft.comments.unshift(newComment._id);
        });
      }}
      onError={utils.UIErrorNotifier}
    >
      {(newComment, { loading }) => (
        <form
          className="add-comment__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLogged) {
              Alert.info('Please login or signup to comment.');
              setShowLogin(true);
              setShowMemberForms(true);
              return;
            }
            newComment();
          }}
        >
          <TextareaAutosize
            className="textarea"
            onChange={e => setCommentBody(e.target.value)}
            value={commentBody}
            required
            rows="6"
            placeholder="Add a Comment"
          />
          <Button
            type="submit"
            classes="btn btn--primary add-comment__submit-btn"
            text="Add Comment"
          />
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
