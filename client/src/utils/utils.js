import Alert from 'react-s-alert';

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const UIErrorNotifier = (err) => {
  err.graphQLErrors.forEach((e) => {
    console.log('*'.repeat(20));
    console.log(e);
    console.log('*'.repeat(20));
  });
  err.graphQLErrors.map(({ message }) => Alert.error(message));
};
