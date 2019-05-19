import React, { useState } from 'react';
import { string } from 'prop-types';
import { Query } from 'react-apollo';
import Comment from '../Comment';
import queries from '../../graphql/queries';
import AddComment from '../AddComment';
import SortByPanel from '../SortByPanel';

import './Comments.sass';

const Comments = ({ postId }) => {
  const [sortBy, setSortBy] = useState('DATE_DESC');

  return (
    <section className="comments">
      <header className="comments__header">
        <h2>Comments</h2>
      </header>
      <AddComment postId={postId} sortBy={sortBy} />
      <SortByPanel setSortBy={setSortBy} />
      <Query
        query={queries.POST_COMMENTS}
        variables={{ postId, sortBy }}
      >
        {({ loading, data: { comments } }) => {
          if (loading) return null;

          return comments.length
            ? (
              <ul className="comments__list">
                {comments.map(comment => (
                  <Comment key={comment._id} comment={comment} postId={postId} />
                ))}
              </ul>
            )
            : <div className="comments__empty">Be the first one to comment</div>;
        }}
      </Query>
    </section>
  );
};

Comments.propTypes = {
  postId: string.isRequired,
};

export default Comments;
