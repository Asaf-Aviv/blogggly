import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import AddComment from '../AddComment';
import SortByPanel from '../SortByPanel';
import CommentsList from '../CommentsList';
import { subscribeToNewComments, subscribeToDeletedComments } from '../../graphql/helpers/subscriptionHelpers';

import './Comments.sass';

const Comments = ({ postId }) => {
  const [sortBy, setSortBy] = useState({ key: 'createdAt', order: 'desc' });

  useEffect(() => {
    const newCommentsSubscription = subscribeToNewComments({ postId });
    const deletedCommentSubscription = subscribeToDeletedComments({ postId });
    return () => {
      newCommentsSubscription.unsubscribe();
      deletedCommentSubscription.unsubscribe();
    };
  }, [postId]);

  return (
    <section className="comments">
      <header className="comments__header">
        <h2>Comments</h2>
      </header>
      <AddComment postId={postId} />
      <SortByPanel setSortBy={setSortBy} />
      <CommentsList postId={postId} sortBy={sortBy} />
    </section>
  );
};

Comments.propTypes = {
  postId: string.isRequired,
};

export default Comments;
