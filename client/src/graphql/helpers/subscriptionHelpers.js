import { cloneDeep } from 'lodash';
import queries from '../queries';
import apolloClient from '../../ApolloClient';

export const subscribeToNewComments = variables => apolloClient
  .subscribe({ query: queries.NEW_POST_COMMENT, variables })
  .subscribe({
    next: ({ data: { newPostComment } }) => {
      const query = { query: queries.POST_COMMENTS, variables };
      const data = cloneDeep(apolloClient.readQuery(query));
      data.comments.push(newPostComment);
      apolloClient.writeQuery({ ...query, data });
    },
    error: err => console.error(err),
  });

export const subscribeToDeletedComments = variables => apolloClient
  .subscribe({ query: queries.DELETED_POST_COMMENT, variables })
  .subscribe({
    next: ({ data: { deletedPostComment: deletedCommentId } }) => {
      const query = { query: queries.POST_COMMENTS, variables };

      const data = cloneDeep(apolloClient.readQuery(query));
      data.comments.splice(
        data.comments.findIndex(comment => comment._id === deletedCommentId), 1,
      );
      apolloClient.writeQuery({ ...query, data });
    },
    error: err => console.error(err),
  });
