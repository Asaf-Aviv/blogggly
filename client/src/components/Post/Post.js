import React, { useContext } from 'react';
import { Query, Mutation } from 'react-apollo';
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

import './Post.sass';

const Post = ({ match: { params: { postId } } }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <Query
      query={queries.POST}
      variables={{ postId, withComments: true }}
      onError={utils.UIErrorNotifier}
    >
      {({ loading, error, data: { post } = {} }) => {
        if (loading) return null;
        if (error) return <Redirect to="/" />;

        return (
          <main className="post__main">
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
                <Likes
                  postId={postId}
                  likesCount={post.likesCount}
                  id={postId}
                  likes={post.likes}
                  isPost
                />
                {loggedUser && loggedUser._id === post.author._id && (
                  <Mutation
                    mutation={queries.DELETE_POST}
                    variables={{ postId: post._id }}
                  >
                    {deletePost => (
                      <button type="button" onClick={deletePost}>Delete</button>
                    )}
                  </Mutation>
                )}
              </article>
              <MoreFromAuthor
                authorName={post.author.username}
                authorId={post.author._id}
                viewingPostId={postId}
              />
              <Comments postId={post._id} comments={post.comments} />
            </Container>
          </main>
        );
      }}
    </Query>
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
