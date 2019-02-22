import React from 'react';
import { Query } from 'react-apollo';

import './Inbox.sass';

const MESSAGES = gql`
  query messages($id: ID) {
    messages(id: $id) {
      _id   
      body
    }
  }
`;

const Inbox = () => (
  <div />
);

export default Inbox;
