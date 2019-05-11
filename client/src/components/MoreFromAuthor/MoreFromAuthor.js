import React from 'react';
import { string } from 'prop-types';
import { Query } from 'react-apollo';
import utils from '../../utils';
import queries from '../../graphql/queries';
import ShowcaseCard from '../ShowcaseCard';

import './MoreFromAuthor.sass';

const MoreFromAuthor = ({ authorId, viewingPostId, authorName }) => (
  <Query
    query={queries.MORE_FROM_AUTHOR}
    variables={{ authorId, viewingPostId }}
    onError={utils.UIErrorNotifier}
  >
    {({ loading, data: { moreFromAuthor } }) => {
      if (loading) return null;

      if (!moreFromAuthor.length) return null;

      return (
        <div className="more-from-author">
          <h2 className="more-from-author__username">{`More from ${authorName}`}</h2>
          <div className="more-from-author__container">
            {moreFromAuthor.map(post => <ShowcaseCard key={post._id} post={post} />)}
          </div>
        </div>
      );
    }}
  </Query>
);

MoreFromAuthor.propTypes = {
  authorId: string.isRequired,
  authorName: string.isRequired,
  viewingPostId: string.isRequired,
};

export default MoreFromAuthor;
