import { string, shape, bool } from 'prop-types';

const UserShortSummaryPropTypes = shape({
  _id: string.isRequired,
  username: string.isRequired,
  avatar: string.isRequired,
});

export const CommentPropTypes = shape({
  _id: string.isRequired,
  body: string.isRequired,
  createdAt: string.isRequired,
  author: UserShortSummaryPropTypes.isRequired,
});

export const MessagePropTypes = shape({
  _id: string.isRequired,
  from: UserShortSummaryPropTypes.isRequired,
  to: UserShortSummaryPropTypes.isRequired,
  body: string.isRequired,
  createdAt: string.isRequired,
  read: bool.isRequired,
});

export const SearchPostPropTypes = shape({
  _id: string.isRequired,
  title: string.isRequired,
  author: UserShortSummaryPropTypes.isRequired,
});

export { UserShortSummaryPropTypes };
