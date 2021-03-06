import React from 'react';
import { Helmet } from 'react-helmet';
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
      if (loading) return <div className="posts" />;

      return (
        <div className="posts">
          <Container>
            <Helmet>
              <title>Posts - Blogggly</title>
            </Helmet>
            <PostList posts={posts} />
          </Container>
        </div>
      );
    }}
  </Query>
);

export default Posts;
