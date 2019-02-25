import React from 'react';
import { Query } from 'react-apollo';
import { shape, string } from 'prop-types';
import moment from 'moment';
import Comments from '../Comments';
import Container from '../Container';
import AuthorDetails from '../AuthorDetails';
import Likes from '../Likes/Likes';
import queries from '../../graphql/queries';
import MoreFromAuthor from '../MoreFromAuthor/MoreFromAuthor';

import './Post.sass';

const Post = ({ match: { params: { postId } } }) => (
  <Query
    query={queries.POST}
    variables={{ postId }}
  >
    {({ loading, error, data: { post } }) => {
      if (loading) return <Container><h1>loading</h1></Container>;
      if (error) return <h1>error</h1>;

      return (
        <Container>
          <main>
            <article className="post">
              <h1 className="post__title">{post.title}</h1>
              <AuthorDetails {...post.author}>
                <span className="post__date">{moment(+post.createdAt).format('LL')}</span>
              </AuthorDetails>
              <span className="post__body" dangerouslySetInnerHTML={{ __html: post.body }} />
              <Likes
                postId={postId}
                likeCount={post.likeCount}
                id={postId}
                likes={post.likes}
                isPost
              />
            </article>
            <MoreFromAuthor authorId={post.author._id} viewingPostId={postId} />
            <Comments postId={post._id} />
          </main>
        </Container>
      );
    }}
  </Query>
);

Post.propTypes = {
  match: shape({
    params: shape({
      postId: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Post;
