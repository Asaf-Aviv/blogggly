import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import { Query, withApollo, Subscription } from 'react-apollo';
import orderBy from 'lodash.orderby';
import { cloneDeep } from 'lodash';
import Comment from '../Comment';
import queries from '../../graphql/queries';
import AddComment from '../AddComment';
import SortByPanel from '../SortByPanel';
import apolloClient from '../../ApolloClient';

import './Comments.sass';

const Comments = ({ postId }) => {
  const [sortBy, setSortBy] = useState({ key: 'createdAt', order: 'desc' });

  useEffect(() => {
    const variables = { postId };

    const newCommentsSubscription = apolloClient
      .subscribe({ query: queries.NEW_POST_COMMENT, variables })
      .subscribe({
        next: ({ data: { newPostComment } }) => {
          const query = { query: queries.POST_COMMENTS, variables };
          const data = cloneDeep(apolloClient.readQuery(query));
          data.comments.push(newPostComment);
          apolloClient.writeQuery({ ...query, data });
        },
        error: err => console.error(err),
      });

    return () => newCommentsSubscription.unsubscribe();
  }, [postId]);

  useEffect(() => {
    const variables = { postId };

    const deletedCommentSubscription = apolloClient
      .subscribe({ query: queries.DELETED_POST_COMMENT, variables })
      .subscribe({
        next: ({ data: { deletedPostComment: deletedCommentId } }) => {
          console.log(deletedCommentId);
          const query = { query: queries.POST_COMMENTS, variables };

          const data = cloneDeep(apolloClient.readQuery(query));
          data.comments.splice(
            data.comments.findIndex(comment => comment._id === deletedCommentId), 1,
          );
          apolloClient.writeQuery({ ...query, data });
        },
        error: err => console.error(err),
      });

    return () => deletedCommentSubscription.unsubscribe();
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
                    ))
                  }
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

export default withApollo(Comments);
