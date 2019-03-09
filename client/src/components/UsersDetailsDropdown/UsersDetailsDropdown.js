import React from 'react';
import { Query } from 'react-apollo';
import { string, arrayOf } from 'prop-types';
import UserAvatar from '../UserAvatar';
import Loader from '../Loader';
import queries from '../../graphql/queries';

import './UsersDetailsDropdown.sass';

const UsersDetailsDropdown = ({ userIds }) => (
  <Query
    query={queries.GET_USERS_BY_IDS}
    variables={{ userIds }}
  >
    {({ loading, error, data: { getUsersByIds: users } }) => {
      if (loading) {
        return (
          <div className="user-details-modal" onClick={e => e.stopPropagation()}>
            <Loader />
          </div>
        );
      }

      if (error) return <h3>Something went wrong</h3>;

      return (
        <div className="user-details-modal" onClick={e => e.stopPropagation()}>
          {users.map(user => (
            <div key={user._id} className="user-details-modal__item">
              <UserAvatar width={30} {...user} />
              <h4 className="user-details-modal__username">{user.username}</h4>
            </div>
          ))}
        </div>
      );
    }
  }
  </Query>
);

UsersDetailsDropdown.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UsersDetailsDropdown;
