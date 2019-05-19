import * as queries from './queries';
import * as mutations from './mutations';
import * as subscriptions from './subscriptions';

export default {
  ...queries,
  ...mutations,
  ...subscriptions,
};
