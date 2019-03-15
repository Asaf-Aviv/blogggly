import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { CountryDropdown } from 'react-country-region-selector';
import { shape, string } from 'prop-types';
import Alert from 'react-s-alert';
import DatePicker from 'react-datepicker';
import Label from '../Label';
import Input from '../Input';
import queries from '../../graphql/queries';

import './UserInformation.sass';

const UserProfileInformation = ({ userInfo }) => {
  const [firstname, setFirstname] = useState(userInfo.firstname);
  const [lastname, setLastname] = useState(userInfo.lastname);
  const [country, setCountry] = useState(userInfo.country);
  const [gender, setGender] = useState(userInfo.gender);
  const [dateOfBirth, setDateOfBirth] = useState(
    (userInfo.dateOfBirth && new Date(userInfo.dateOfBirth)) || null,
  );

  return (
    <Mutation
      mutation={queries.UPDATE_USER_INFO}
      variables={{
        info: {
          firstname,
          lastname,
          country,
          gender,
          dateOfBirth,
        },
      }}
      onCompleted={() => Alert.success('Information updated successfully.')}
    >
      {updateUserInfo => (
        <div className="user-info">
          <form onSubmit={(e) => {
            e.preventDefault();
            updateUserInfo();
          }}
          >
            <div className="user-info__input-group">
              <Label labelFor="firstname" text="First Name">
                <Input
                  value={firstname}
                  onChange={setFirstname}
                  placeholder="First Name"
                  autoComplete
                />
              </Label>
              <Label labelFor="lastname" text="Last Name">
                <Input
                  value={lastname}
                  onChange={setLastname}
                  placeholder="Last Name"
                  autoComplete
                />
              </Label>
            </div>
            <div className="user-info__input-group">
              <Label labelFor="country">
                <CountryDropdown className="input" value={country} onChange={val => setCountry(val)} />
              </Label>
              <Label labelFor="gender">
                <select
                  className="input"
                  onChange={e => setGender(e.target.value)}
                  value={gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Label>
            </div>
            <div className="user-info__input-group">
              <Label labelFor="date of birth" text="Date Of Birth">
                <DatePicker
                  placeholderText="MM/DD/YYYY"
                  className="input"
                  selected={dateOfBirth}
                  onChange={date => setDateOfBirth(date)}
                />
              </Label>
            </div>
            <button className="btn btn--primary user-info__submit-btn" type="submit">Update</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

UserProfileInformation.propTypes = {
  userInfo: shape({
    firstname: string.isRequired,
    lastname: string.isRequired,
    gender: string.isRequired,
    country: string.isRequired,
    dateOfBirth: string.isRequired,
  }).isRequired,
};

export default UserProfileInformation;