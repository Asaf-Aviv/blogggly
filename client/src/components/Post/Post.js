import React, { useContext } from 'react';
import { Query, Subscription } from 'react-apollo';
import { shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { Helmet } from 'react-helmet';
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
import ActionsDropDown from '../ActionsDropDown';

import './Post.sass';

const Post = ({ match: { params: { postId } } }) => {
  const { loggedUser, isLogged } = useContext(UserContext);

  return (
    <div className="post__main">
      <Query
        query={queries.POST}
        variables={{ postId }}
        onError={utils.UIErrorNotifier}
      >
        {({ loading, error, data: { post } = {} }) => {
          if (loading) return null;
          if (error) return <Redirect to="/" />;

          return (
            <Subscription
              subscription={queries.POST_LIKES_UPDATES}
              variables={{ postId }}
            >
              {() => (
                <Container>
                  <article className="post">
                    <Helmet titleTemplate="%s - Blogggly">
                      <title>{post.title}</title>
                      <meta name="title" content={post.title} />
                      <meta
                        name="description"
                        content={`${post.body.slice(0, 500).replace(/<[^>]*>?/gm, '').slice(0, post.body.lastIndexOf(' ', 200))}...`}
                      />
                      <link rel="author" href={`https://blogggly.com/user/${post.author.username}`} />
                      <meta name="author" content={post.author.username} />
                    </Helmet>
                    <header className="post__header">
                      <h1 className="post__title">{post.title}</h1>
                      <div className="post__tags">
                        <Tags tags={post.tags} />
                      </div>
                      <ActionsDropDown
                        type="post"
                        resourceId={post._id}
                        isAuthor={isLogged && loggedUser._id === post.author._id}
                      />
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
                    </div>
                  </article>
                  <MoreFromAuthor
                    authorName={post.author.username}
                    authorId={post.author._id}
                    viewingPostId={postId}
                  />
                  <Comments postId={post._id} />
                </Container>
              )}
            </Subscription>
          );
        }}
      </Query>
    </div>
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
