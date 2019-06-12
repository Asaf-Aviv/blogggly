import React from 'react';
import { Query } from 'react-apollo';
import Container from '../Container';
import queries from '../../graphql/queries';
import utils from '../../utils';
import PostList from '../PostsList';

import './Posts.sass';

const Posts = () => (
  <Query
    query={queries.GET_FEATURED_POSTS}
    onError={utils.UIErrorNotifier}
  >
    {({ loading, data: { posts } }) => {
      if (loading) return null;

      return (
        <div className="posts">
          <Container>
            <PostList posts={posts} />
          </Container>
        </div>
      );
    }}
  </Query>
);

export default Posts;
