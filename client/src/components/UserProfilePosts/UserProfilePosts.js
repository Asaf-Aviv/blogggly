import React from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import ShowcaseCard from '../ShowcaseCard';

import './UserProfilePosts.sass';

const UserProfilePosts = ({ postIds }) => (
  <Query
    query={queries.GET_POSTS_BY_IDS}
    onError={utils.UIErrorNotifier}
    variables={{ postIds }}
  >
    {({ loading, data: { posts } }) => {
      if (loading) return null;

      return (
        <div className="user-profile__posts">
          {posts.map(post => (
            <ShowcaseCard key={post._id} post={post} isAuthor />
          ))}
        </div>
      );
    }}
  </Query>
);


UserProfilePosts.propTypes = {
  postIds: arrayOf(string).isRequired,
};

export default UserProfilePosts;
