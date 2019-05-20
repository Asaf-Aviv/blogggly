import React, { useState, useContext } from 'react';
import { string } from 'prop-types';
import { Query, Subscription } from 'react-apollo';
import orderBy from 'lodash.orderby';
import Comment from '../Comment';
import queries from '../../graphql/queries';
import AddComment from '../AddComment';
import SortByPanel from '../SortByPanel';
import { UserContext } from '../../context';

import './Comments.sass';

const Comments = ({ postId }) => {
  const [sortBy, setSortBy] = useState({ key: 'createdAt', order: 'desc' });
  const { isLogged, loggedUser } = useContext(UserContext);

  return (
    <>
      <Subscription
        subscription={queries.NEW_POST_COMMENT}
        variables={{ postId, currentUserId: isLogged ? loggedUser._id : null }}
        onSubscriptionData={({ client, subscriptionData }) => {
          const { newPostComment } = subscriptionData.data;
          const query = {
            query: queries.POST_COMMENTS,
            variables: { postId },
          };
          const data = client.cache.readQuery(query);
          data.comments.push(newPostComment);
          client.cache.writeQuery({ ...query, data });
        }}
      >
        {() => (
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
                  <ul className="comments__list">
                    {orderBy(comments, sortBy.key, sortBy.order)
                      .map(comment => (
                        <Comment key={comment._id} comment={comment} postId={postId} />
                      ))
                  }
                  </ul>
                );
              }}
            </Query>
          </section>
        )}
      </Subscription>
    </>
  );
};

Comments.propTypes = {
  postId: string.isRequired,
};

export default Comments;
