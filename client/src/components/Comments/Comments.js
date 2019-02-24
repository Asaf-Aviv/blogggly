import React from 'react';
import { Query } from 'react-apollo';
import { string } from 'prop-types';
import Comment from '../Comment';
import AddComment from '../AddComment';
import queries from '../../graphql/queries';

import './Comments.sass';

const Comments = ({ postId }) => (
  <Query
    query={queries.COMMENTS}
    variables={{ postId }}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>loading</p>;
      if (error) return <p>error</p>;

      return (
        <div className="comments">
          <h2 className="comments__header">Comments</h2>
          <AddComment postId={postId} />
          <ul className="comments__list">
            {data.postComments.map(comment => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </ul>
        </div>
      );
    }}
  </Query>
);

Comments.propTypes = {
  postId: string.isRequired,
};

export default Comments;
