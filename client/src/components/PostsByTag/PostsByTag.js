import React from 'react';
import { Query } from 'react-apollo';
import { shape, string } from 'prop-types';
import queries from '../../graphql/queries';
import Container from '../Container';
import PostsList from '../PostsList';
import utils from '../../utils';

import './PostsByTag.sass';

const PostsByTag = ({ match: { params: { tag } } }) => (
  <Query
    query={queries.GET_POSTS_BY_TAG}
    variables={{ tag }}
    onError={utils.UIErrorNotifier}
  >
    {({ loading, data: { posts } }) => {
      if (loading) return null;

      return (
        <div className="posts-by-tag">
          <Container>
            <PostsList posts={posts} />
          </Container>
        </div>
      );
    }}
  </Query>
);

PostsByTag.propTypes = {
  match: shape({
    params: shape({
      tag: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PostsByTag;
