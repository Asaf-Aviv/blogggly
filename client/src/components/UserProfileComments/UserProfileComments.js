import React from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';

const UserProfileComments = ({ commentIds }) => (
  <Query
    query={queries.GET_COMMENTS_BY_IDS}
    onError={utils.UIErrorNotifier}
    variables={{ commentIds }}
  >
    {({ data: { getCommentsByIds: comments }, loading }) => {
      if (loading) return <h1>loading</h1>;

      return comments.map(comment => (
        <h1 key={comment._id}>{comment._id}</h1>
      ));
    }}
  </Query>
);

UserProfileComments.propTypes = {
  commentIds: arrayOf(string).isRequired,
};

export default UserProfileComments;
