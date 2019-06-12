import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import { Helmet } from 'react-helmet';
import queries from '../../graphql/queries';
import utils from '../../utils';
import ShowcaseCard from '../ShowcaseCard';
import { UserContext } from '../../context';

import './UserProfilePosts.sass';

const UserProfilePosts = ({ postIds }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <Query
      query={queries.GET_POSTS_BY_IDS}
      onError={utils.UIErrorNotifier}
      variables={{ postIds }}
    >
      {({ loading, data: { posts } }) => {
        if (loading) return null;

        return (
          <div className="user-profile__posts">
            <Helmet>
              <title>{`${loggedUser.username}'s Posts - Blogggly`}</title>
            </Helmet>
            {posts.map(post => (
              post
                ? <ShowcaseCard key={post._id} post={post} isAuthor />
                : null
            ))}
          </div>
        );
      }}
    </Query>
  );
};

UserProfilePosts.propTypes = {
  postIds: arrayOf(string).isRequired,
};

export default UserProfilePosts;
