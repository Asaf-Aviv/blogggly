import Alert from 'react-s-alert';

export const lockScrollBody = () => {
  document.querySelector('body').style.overflowY = 'hidden';
};

export const unlockScrollBody = () => {
  document.querySelector('body').style.overflowY = 'auto';
};

export const validateEmail = (email) => {
  console.log('validating email');
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  console.log('validating password');
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

export const validateUsername = (username) => {
  console.log('validating username');
  const re = /^[a-zA-Z0-9_]+$/;
  return re.test(username);
};

export const UIErrorNotifier = (err) => {
  err.graphQLErrors.forEach((e) => {
    console.log('*'.repeat(20));
    console.log(e);
    console.log('*'.repeat(20));
  });
  err.graphQLErrors.map(({ message }) => Alert.error(message));
};
