import * as userSubscriptions from './user';
import * as postSubscriptions from './post';
import * as commentSubscriptions from './comment';

export default {
  ...userSubscriptions,
  ...postSubscriptions,
  ...commentSubscriptions,
};
