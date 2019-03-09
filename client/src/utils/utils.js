import Alert from 'react-s-alert';

export const validateEmail = (email, cb) => {
  console.log('validating email');
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(String(email).toLowerCase());

  if (cb) {
    return cb(isValid);
  }

  return isValid;
};

export const validatePassword = (password, cb) => {
  console.log('validating password');
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const isValid = re.test(password);

  if (cb) {
    return cb(isValid);
  }

  return isValid;
};

export const validateUsername = (password, cb) => {
  console.log('validating password');
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const isValid = re.test(password);

  if (cb) {
    return cb(isValid);
  }

  return isValid;
};

export const UIErrorNotifier = (err) => {
  err.graphQLErrors.forEach((e) => {
    console.log('*'.repeat(20));
    console.log(e);
    console.log('*'.repeat(20));
  });
  err.graphQLErrors.map(({ message }) => Alert.error(message));
};
