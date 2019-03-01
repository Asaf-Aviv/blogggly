import React from 'react';
import { Query } from 'react-apollo';
import queries from '../../graphql/queries';

const Posts = () => (
  <Query query={queries.POSTS}>
    {({ loading, error, data }) => {
      if (loading) return <h1>loading</h1>;
      if (error) return <h1>Error</h1>;

      return (
        data.posts.map(({ _id }) => (
          <h1 key={_id}>{_id}</h1>
        ))
      );
    }}
  </Query>
);

export default Posts;
