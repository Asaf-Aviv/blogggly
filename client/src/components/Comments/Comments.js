import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { string } from 'prop-types';

import './Comments.sass';

const COMMENTS = gql`
  query postComments($postId: ID) {
    postComments(postId: $postId) {
      _id
      body
    }
  } 
`;

const Comments = ({ postId }) => {
  const a = '';

  return (
    <Query
      query={COMMENTS}
      variables={{ postId }}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>loading</p>;
        if (error) return <p>error</p>;

        return data.postComments.map(comment => (
          <div key={comment._id}>
            <p>{comment.body}</p>
          </div>
        ));
      }}
    </Query>
  );
};

Comments.propTypes = {
  postId: string.isRequired,
};

export default Comments;
