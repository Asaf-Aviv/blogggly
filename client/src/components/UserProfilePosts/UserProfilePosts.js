import React from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';

const UserProfilePosts = ({ postIds }) => (
  <Query
    query={queries.GET_POSTS_BY_IDS}
    onError={utils.UIErrorNotifier}
    variables={{ postIds }}
  >
    {({ data: { posts }, loading }) => {
      if (loading) return <h1>loading</h1>;

      return posts.map(post => (
        <h1 key={post._id}>{post._id}</h1>
      ));
    }}
  </Query>
);

UserProfilePosts.propTypes = {
  postIds: arrayOf(string).isRequired,
};

export default UserProfilePosts;
