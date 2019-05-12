import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { string, shape } from 'prop-types';
import ShowcaseCard from '../ShowcaseCard';
import Container from '../Container';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserContext } from '../../context';

import './Posts.sass';

const Posts = ({ match: { params: { tag } } }) => {
  const { loggedUser, isLogged } = useContext(UserContext);

  return (
    <Query
      query={queries.GET_POSTS_BY_TAG}
      variables={{ tag }}
      onError={utils.UIErrorNotifier}
    >
      {({ loading, data: { posts } }) => {
        if (loading) return null;

        return (
          <Container>
            <div className="posts__container">
              {posts.map(post => (
                <ShowcaseCard
                  key={post._id}
                  post={post}
                  isAuthor={isLogged && loggedUser._id === post.author._id}
                />
              ))}
            </div>
          </Container>
        );
      }}
    </Query>
  );
};

Posts.propTypes = {
  match: shape({
    params: shape({
      tag: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Posts;
