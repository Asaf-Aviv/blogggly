import { string, shape } from 'prop-types';

export const CommentPropTypes = shape({
  _id: string.isRequired,
  body: string.isRequired,
  createdAt: string.isRequired,
  author: shape({
    _id: string.isRequired,
    username: string.isRequired,
    avatar: string.isRequired,
  }).isRequired,
});
