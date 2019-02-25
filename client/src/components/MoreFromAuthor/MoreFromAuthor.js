import React from 'react';
import gql from 'graphql-tag';
import { string } from 'prop-types';
import { Query } from 'react-apollo';
import utils from '../../utils';
import Container from '../Container';

const MORE_FROM_AUTHOR = gql`
  query moreFromAuthor($authorId: ID, $viewingPostId: ID) {
    moreFromAuthor(authorId: $authorId, viewingPostId: $viewingPostId) {
      _id
      title
      body
      likeCount
      author {
        _id
        username
      }
    }
  }
`;

const MoreFromAuthor = ({ authorId, viewingPostId }) => (
  <Query
    query={MORE_FROM_AUTHOR}
    variables={{ authorId, viewingPostId }}
    onError={utils.UIErrorNotifier}
  >
    {({ loading, error, data: { moreFromAuthor } }) => {
      if (loading) return <Container><h1>loading</h1></Container>;
      if (error) return console.log(error) || <h1>error</h1>;

      return moreFromAuthor.map(post => (
        <div key={post._id} className="author-showcase">
          <p>{post.title}</p>
          <p>{post.author.username}</p>
          <p>{post.body}</p>
          <i className="heart fa-heart fas" />
          <span>{post.likeCount}</span>
        </div>
      ));
    }}
  </Query>
);

MoreFromAuthor.propTypes = {
  authorId: string.isRequired,
  viewingPostId: string.isRequired,
};

export default MoreFromAuthor;
