import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';

const UserPosts = () => {
  const { loggedUser } = useContext(UserContext);

  return (
    loggedUser && (
      <Query
        query={queries.USER_POSTS}
        variables={{ id: loggedUser._id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <h1>Loading</h1>;
          if (error) return <h1>Error</h1>;

          return data.userPosts.map(post => (
            <div key={post._id}>
              <h1>{post._id}</h1>
              <p>{post.creeatedAt}</p>
              <p>{post.title}</p>
              <p>{post.body}</p>
            </div>
          ));
        }}
      </Query>
    )
  );
};

export default UserPosts;
