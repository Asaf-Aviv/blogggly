import * as userQueries from './post';
import * as postQueries from './user';
import * as commentQueries from './comment';

export default {
  ...userQueries,
  ...postQueries,
  ...commentQueries,
};
