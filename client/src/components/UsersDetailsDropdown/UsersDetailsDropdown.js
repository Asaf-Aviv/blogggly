import React from 'react';
import { Query } from 'react-apollo';
import { string, arrayOf } from 'prop-types';
import { Link } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import Loader from '../Loader';
import queries from '../../graphql/queries';

import './UsersDetailsDropdown.sass';

const UsersDetailsDropdown = ({ userIds }) => (
  <Query
    query={queries.GET_USERS_BY_IDS}
    variables={{ userIds }}
  >
    {({ loading, error, data: { users } }) => {
      if (loading) {
        return (
          <div className="user-details-modal" onClick={e => e.stopPropagation()}>
            <Loader />
          </div>
        );
      }

      if (error) {
        return (
          <div className="user-details-modal">
            <span>Something went wrong</span>
          </div>
        );
      }

      return (
        <div className="user-details-modal">
          {users.map(user => (
            <Link to={`/user/${user.username}`}>
              <div key={user._id} className="user-details-modal__item">
                <UserAvatar width={30} {...user} />
                <h4 className="user-details-modal__username">{user.username}</h4>
              </div>
            </Link>
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
