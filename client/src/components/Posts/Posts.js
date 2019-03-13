import React from 'react';
import { Query } from 'react-apollo';
import { string, shape } from 'prop-types';
import qs from 'qs';
import ShowcaseCard from '../ShowcaseCard';
import queries from '../../graphql/queries';

const Posts = ({ location: { search } }) => {
  console.log(qs.parse(search, { ignoreQueryPrefix: true }));

  const { tags } = qs.parse(search, { ignoreQueryPrefix: true });

  console.log(tags);

  return (
    <Query
      query={queries[tags ? 'GET_POSTS_BY_TAGS' : 'POSTS']}
      variables={{ tags }}
    >
      {({ loading, error, data: { posts } }) => {
        if (loading) return <h1>loading</h1>;
        if (error) return <h1>Error</h1>;

        return (
          posts.map(post => (
            <ShowcaseCard key={post._id} post={post} />
          ))
        );
      }}
    </Query>
  );
};

Posts.propTypes = {
  location: shape({
    search: string.isRequired,
  }).isRequired,
};

export default Posts;
