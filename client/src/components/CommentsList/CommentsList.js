import React, { useContext } from 'react';
import { Query, Subscription } from 'react-apollo';
import { orderBy } from 'lodash';
import { string, shape } from 'prop-types';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import Comment from '../Comment';

const CommentsList = ({ postId, sortBy }) => {
  const { isLogged, loggedUser } = useContext(UserContext);

  return (
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
                    <Comment
                      key={comment._id}
                      comment={comment}
                      postId={postId}
                      isAuthor={isLogged && loggedUser._id === comment.author._id}
                    />
                  ))}
              </ul>
            )}
          </Subscription>
        );
      }}
    </Query>
  );
};

CommentsList.propTypes = {
  postId: string.isRequired,
  sortBy: shape({
    key: string.isRequired,
    order: string.isRequired,
  }).isRequired,
};

export default CommentsList;
