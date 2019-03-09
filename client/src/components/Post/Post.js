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

import './Post.sass';
import Tags from '../Tags/Tags';

const Post = ({ match: { params: { postId } } }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <Query
      query={queries.POST}
      variables={{ postId, withComments: true }}
      onError={utils.UIErrorNotifier}
    >
      {({ loading, error, data: { post } }) => {
        if (loading) return <Container><h1>loading</h1></Container>;
        if (error) return <Redirect to="/" />;

        return (
          <Container>
            <main>
              <article className="post">
                <h1 className="post__title">{post.title}</h1>
                <div className="post__tags">
                  <Tags tags={post.tags} />
                </div>
                <AuthorDetails {...post.author}>
                  {post.author._id !== (loggedUser && loggedUser._id) && (
                    <FollowButton
                      following={!!loggedUser && loggedUser.following.includes(post.author._id)}
                      authorId={post.author._id}
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
              </article>
              <MoreFromAuthor
                authorName={post.author.username}
                authorId={post.author._id}
                viewingPostId={postId}
              />
              <Comments postId={post._id} comments={post.comments} />
            </main>
          </Container>
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
