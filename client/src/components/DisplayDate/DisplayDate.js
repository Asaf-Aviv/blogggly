import React from 'react';
import { string } from 'prop-types';
import moment from 'moment';

const DisplayDate = ({ date, format }) => (
  <span className="date">
    {format
      ? moment(+date).format(format)
      : moment(+date).startOf('seconds').fromNow()
    }
  </span>
);

DisplayDate.propTypes = {
  date: string.isRequired,
  format: string,
};

DisplayDate.defaultProps = {
  format: '',
};

export default DisplayDate;
