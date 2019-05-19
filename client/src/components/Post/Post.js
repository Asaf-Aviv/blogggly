import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import Comments from '../Comments';
import Container from '../Container';
import AuthorDetails from '../AuthorDetails';
import Likes from '../Likes/Likes';
import queries from '../../graphql/queries';
import MoreFromAuthor from '../MoreFromAuthor';
import FollowButton from '../FollowButton';
import utils from '../../utils';
import { UserContext } from '../../context';
import Tags from '../Tags/Tags';
import DeletePostButton from '../DeletePostButton';

import './Post.sass';

const Post = ({ match: { params: { postId } } }) => {
  const { loggedUser, isLogged } = useContext(UserContext);

  return (
    <main className="post__main">
      <Query
        query={queries.POST}
        variables={{ postId }}
        onError={utils.UIErrorNotifier}
      >
        {({ loading, error, data: { post } = {} }) => {
          if (loading) return null;
          if (error) return <Redirect to="/" />;

          return (
            <Container>
              <article className="post">
                <header className="post__header">
                  <h1 className="post__title">{post.title}</h1>
                  <div className="post__tags">
                    <Tags tags={post.tags} />
                  </div>
                </header>
                <AuthorDetails {...post.author}>
                  {post.author._id !== (loggedUser && loggedUser._id) && (
                  <FollowButton
                    following={!!loggedUser && loggedUser.following.includes(post.author._id)}
                    userId={post.author._id}
                    username={post.author.username}
                  />
                  )}
                  <span className="post__date">{moment(+post.createdAt).format('LL')}</span>
                </AuthorDetails>
                <span className="post__body" dangerouslySetInnerHTML={{ __html: post.body }} />
                <div className="post__actions">
                  <Likes
                    postId={postId}
                    likesCount={post.likesCount}
                    id={postId}
                    likes={post.likes}
                    isPost
                  />
                  {isLogged && loggedUser._id === post.author._id && (
                    <DeletePostButton postId={postId} />
                  )}
                </div>
              </article>
              <MoreFromAuthor
                authorName={post.author.username}
                authorId={post.author._id}
                viewingPostId={postId}
              />
              <Comments postId={post._id} />
            </Container>
          );
        }}
      </Query>
    </main>
  );
};

Post.propTypes = {
  match: shape({
    params: shape({
      postId: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Post;
