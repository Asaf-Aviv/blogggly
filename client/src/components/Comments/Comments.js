import React from 'react';
import { string, arrayOf } from 'prop-types';
import { Query } from 'react-apollo';
import Comment from '../Comment';
import queries from '../../graphql/queries';
import AddComment from '../AddComment';

import './Comments.sass';

const Comments = ({ commentIds, postId }) => (
  <section className="comments">
    <header className="comments__header">
      <h2>Comments</h2>
    </header>
    <AddComment postId={postId} />
    {commentIds.length > 0
      ? (
        <Query
          query={queries.GET_COMMENTS_BY_IDS}
          variables={{ commentIds, withAuthorInfo: true }}
        >
          {({ loading, data: { comments } = {} }) => {
            if (loading) return null;

            return (
              <ul className="comments__list">
                {comments.map(comment => (
                  <Comment key={comment._id} comment={comment} postId={postId} />
                ))}
              </ul>
            );
          }}
        </Query>
      )
      : <div className="comments__empty">Be the first one to comment</div>
    }
  </section>
);

Comments.propTypes = {
  postId: string.isRequired,
  commentIds: arrayOf(string).isRequired,
};

export default Comments;
