import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { CountryDropdown } from 'react-country-region-selector';
import { shape, string } from 'prop-types';
import Alert from 'react-s-alert';
import { Helmet } from 'react-helmet';
import DatePicker from 'react-datepicker';
import Label from '../Label';
import Input from '../Input';
import queries from '../../graphql/queries';
import { UserContext } from '../../context';
import Button from '../Button';

import './UserInformation.sass';
import 'react-datepicker/dist/react-datepicker.css';

const UserProfileInformation = ({ userInfo }) => {
  const [firstname, setFirstname] = useState(userInfo.firstname);
  const [lastname, setLastname] = useState(userInfo.lastname);
  const [country, setCountry] = useState(userInfo.country);
  const [gender, setGender] = useState(userInfo.gender);
  const [bio, setBio] = useState(userInfo.bio);
  const [dateOfBirth, setDateOfBirth] = useState(
    (userInfo.dateOfBirth && new Date(userInfo.dateOfBirth)) || null,
  );

  const { loggedUser, setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.UPDATE_USER_INFO}
      variables={{
        info: {
          firstname,
          lastname,
          bio,
          country,
          gender,
          dateOfBirth,
        },
      }}
      onCompleted={({ updateUserInfo }) => {
        setLoggedUser((draft) => {
          draft.info = updateUserInfo.info;
        });
        Alert.success('Information updated successfully.');
      }}
    >
      {updateUserInfo => (
        <div className="user-info">
          <Helmet>
            <title>{`${loggedUser.username} - Information - Blogggly`}</title>
          </Helmet>
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
                <div className="input__wrapper">
                  <div className="input__container">
                    <CountryDropdown className="input" value={country} onChange={val => setCountry(val)} />
                  </div>
                </div>
              </Label>
              <Label labelFor="gender">
                <div className="input__wrapper">
                  <div className="input__container">
                    <select
                      className="input"
                      onChange={e => setGender(e.target.value)}
                      value={gender}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </Label>
            </div>
            <div className="user-info__input-group">
              <Label labelFor="date of birth" text="Date Of Birth">
                <div className="input__wrapper">
                  <div className="input__container">
                    <DatePicker
                      placeholderText="MM/DD/YYYY"
                      className="input"
                      selected={dateOfBirth}
                      onChange={date => setDateOfBirth(date)}
                    />
                  </div>
                </div>
              </Label>
            </div>
            <div className="user-info__input-group">
              <Label labelFor="bio">
                <div className="input__wrapper">
                  <div className="input__container">
                    <textarea
                      placeholder="Bio"
                      className="textarea user-info__textarea"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows="6"
                    />
                  </div>
                </div>
              </Label>
            </div>
            <Button type="submit" classes="btn btn--success user-info__submit-btn" text="Update" />
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
    dateOfBirth: string,
  }).isRequired,
};

export default UserProfileInformation;
