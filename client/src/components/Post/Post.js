import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { shape, string } from 'prop-types';
import Comments from '../Comments';

import './Post.sass';

const POST = gql`
  query post($id: ID) {
    post(id: $id) {
      _id
      title
      body
      createdAt
    }
  }
`;

const Post = ({ match: { params: { id } } }) => (
  <Query
    query={POST}
    variables={{ id }}
  >
    {({ loading, error, data: { post } }) => {
      if (loading) return <h1>lading</h1>;
      if (error) return <h1>error</h1>;

      return (
        <>
          <div key={post._id}>
            <h1>{post._id}</h1>
            <p>{post.createdAt}</p>
            <p>{post.title}</p>
            <p>{post.body}</p>
          </div>
          <Comments postId={post._id} />
        </>
      );
    }}
  </Query>
);

Post.propTypes = {
  match: shape({
    params: shape({
      id: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Post;
