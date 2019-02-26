import React from 'react';
import { Query } from 'react-apollo';
import { shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import Comments from '../Comments';
import Container from '../Container';
import AuthorDetails from '../AuthorDetails';
import Likes from '../Likes/Likes';
import queries from '../../graphql/queries';
import MoreFromAuthor from '../MoreFromAuthor/MoreFromAuthor';

import './Post.sass';
import utils from '../../utils';

const Post = ({ match: { params: { postId } } }) => (
  <Query
    query={queries.POST}
    variables={{ postId }}
    onError={utils.UIErrorNotifier}
  >
    {({ loading, error, data }) => {
      if (loading) return <Container><h1>loading</h1></Container>;
      if (error) return <Redirect to="/" />;

      return (
        <Container>
          <main>
            <article className="post">
              <h1 className="post__title">{data.post.title}</h1>
              <AuthorDetails {...data.post.author}>
                <span className="post__date">{moment(+data.post.createdAt).format('LL')}</span>
              </AuthorDetails>
              <span className="post__body" dangerouslySetInnerHTML={{ __html: data.post.body }} />
              <Likes
                postId={postId}
                likeCount={data.post.likeCount}
                id={postId}
                likes={data.post.likes}
                isPost
              />
            </article>
            <MoreFromAuthor authorId={data.post.author._id} viewingPostId={postId} />
            <Comments postId={data.post._id} />
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
