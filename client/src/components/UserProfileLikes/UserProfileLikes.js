import React, { useState } from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string, shape } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';

const UserProfileLikes = ({ likes }) => {
  const [showCategory, setShowCategory] = useState('posts');

  return (
    <Query
      query={queries.GET_USER_LIKES}
      variables={{ postIds: likes.posts, commentIds: likes.comments }}
      onError={utils.UIErrorNotifier}
    >
      {({ data: { posts, comments }, loading }) => {
        if (loading) return <h1>loading</h1>;

        return (
          <>
            <div className="tabs">
              <button type="button" onClick={() => setShowCategory('posts')}>Posts</button>
              <button type="button" onClick={() => setShowCategory('comments')}>Comments</button>
            </div>
            {showCategory === 'posts'
              ? posts.map(post => <h1>{post._id}</h1>)
              : comments.map(comment => <h1>{comment._id}</h1>)
          }
          </>
        );
      }}
    </Query>
  );
};

UserProfileLikes.propTypes = {
  likes: shape({
    posts: arrayOf(string).isRequired,
    comments: arrayOf(string).isRequired,
  }).isRequired,
};

export default UserProfileLikes;
