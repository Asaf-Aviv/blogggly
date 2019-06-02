import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import Button from '../Button';


const FriendRequestHeaderActions = ({ userIds }) => {
  const { setLoggedUser } = useContext(UserContext);

  if (!userIds.length) return null;

  return (
    <>
      <Mutation
        mutation={queries.DECLINE_ALL_FRIEND_REQUESTS}
        variables={{ userIds }}
        onCompleted={() => {
          setLoggedUser((draft) => {
            draft.incomingFriendRequests.length = 0;
          });
        }}
      >
        {declineAllFriendRequests => (
          <Button
            classes="notifications__action-btn"
            text="Decline All"
            onClick={declineAllFriendRequests}
          />
        )}
      </Mutation>
      <Mutation
        mutation={queries.ACCEPT_ALL_FRIEND_REQUESTS}
        variables={{ userIds }}
        onCompleted={() => {
          setLoggedUser((draft) => {
            draft.friends.push(...userIds);
            draft.incomingFriendRequests.length = 0;
          });
        }}
      >
        {acceptAllFriendRequests => (
          <Button
            classes="notifications__action-btn"
            text="Accept All"
            onClick={acceptAllFriendRequests}
          />
        )}
      </Mutation>
    </>
  );
};

FriendRequestHeaderActions.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default FriendRequestHeaderActions;
