import * as userQueries from './post';
import * as userAuthQueries from './userAuth';
import * as postQueries from './user';
import * as commentQueries from './comment';

export default {
  ...userQueries,
  ...userAuthQueries,
  ...postQueries,
  ...commentQueries,
};
