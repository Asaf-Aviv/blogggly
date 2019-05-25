import * as userMutations from './user';
import * as userAuthMutations from './userAuth';
import * as messageMutations from './message';
import * as postMutations from './post';
import * as commentMutations from './comment';

export default {
  ...userMutations,
  ...userAuthMutations,
  ...messageMutations,
  ...postMutations,
  ...commentMutations,
};
