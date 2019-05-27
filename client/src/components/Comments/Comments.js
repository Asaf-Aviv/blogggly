import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import { Query, Subscription } from 'react-apollo';
import orderBy from 'lodash.orderby';
import Comment from '../Comment';
import queries from '../../graphql/queries';
import AddComment from '../AddComment';
import SortByPanel from '../SortByPanel';
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
      <Query
        query={queries.POST_COMMENTS}
        variables={{ postId }}
      >
        {({ loading, data: { comments } }) => {
          if (loading) return null;
          if (!comments.length) return <div className="comments__empty">Be the first one to comment</div>;

          return (
            <Subscription
              subscription={queries.COMMENT_LIKES_UPDATES}
              variables={{ postId }}
            >
              {() => (
                <ul className="comments__list">
                  {orderBy(comments, sortBy.key, sortBy.order)
                    .map(comment => (
                      <Comment key={comment._id} comment={comment} postId={postId} />
                    ))}
                </ul>
              )}
            </Subscription>
          );
        }}
      </Query>
    </section>
  );
};

Comments.propTypes = {
  postId: string.isRequired,
};

export default Comments;
