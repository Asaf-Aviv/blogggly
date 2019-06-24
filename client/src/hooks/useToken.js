import { useEffect, useState } from 'react';
import queries from '../graphql/queries';
import apolloClient, { wsClient } from '../ApolloClient';

const useToken = (isLogged, setLoggedUser) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const relog = async () => {
      try {
        const { data: { relog: relogResult } } = await apolloClient.mutate({
          mutation: queries.RELOG,
        });
        setLoggedUser(() => relogResult);
      } catch (error) {
        setToken(null);
        localStorage.removeItem('token');
      }
    };

    if (!isLogged && token) relog();
  }, [isLogged, setLoggedUser, setToken, token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // force reconnect with the new token
      wsClient.close(false, false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedUser(() => null);
    setToken(null);
  };

  return { setToken, logout };
};

export default useToken;
