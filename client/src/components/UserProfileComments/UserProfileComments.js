import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserContext } from '../../context';
import UserProfileComment from '../UserProfileComment/UserProfileComment';

const UserProfileComments = ({ commentIds }) => {
  const [deletedCommentsIds, setDeletedCommentsIds] = useState([]);

  const { setLoggedUser } = useContext(UserContext);

  const cacheDeletedComments = useRef([]);

  const addToDeletionQueue = (commentId) => {
    setDeletedCommentsIds([...deletedCommentsIds, commentId]);
  };

  useEffect(() => {
    if (deletedCommentsIds.length) {
      cacheDeletedComments.current = [...deletedCommentsIds];
    }
  }, [deletedCommentsIds]);

  useEffect(() => () => {
    const notInQueue = commentId => !cacheDeletedComments.current.includes(commentId);

    setLoggedUser((draft) => {
      draft.comments = draft.comments.filter(notInQueue);
      draft.likes.comments = draft.likes.comments.filter(notInQueue);
    });
  }, [setLoggedUser]);

  return (
    <Query
      query={queries.GET_COMMENTS_BY_IDS}
      onError={utils.UIErrorNotifier}
      variables={{ commentIds, withPostInfo: true }}
    >
      {({ data, loading }) => {
        if (loading) return null;

        return (
          <div className="user-profile__comments-container">
            <ul>
              {data.comments.map(comment => (
                <UserProfileComment
                  key={comment._id}
                  comment={comment}
                  isDeleted={deletedCommentsIds.includes(comment._id)}
                  addToDeletionQueue={addToDeletionQueue}
                />
              ))}
            </ul>
          </div>
        );
      }}
    </Query>
  );
};

UserProfileComments.propTypes = {
  commentIds: arrayOf(string).isRequired,
};

export default UserProfileComments;
