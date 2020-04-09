import React from "react";
import ReactDOM from "react-dom";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client'
import Cookies from 'js-cookie';
import gql from 'graphql-tag';



import { resolvers, typeDefs } from './resolvers';

import Pages from './pages';
import Login from './pages/login';

import "./styles.css";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: createUploadLink({
    uri: 'http://localhost:6640/graphql',
    // headers: {
    //   authorization: localStorage.getItem('token'),
    //   'client-name': 'Space Explorer [web]',
    //   'client-version': '1.0.0',
    // },
  }),
  resolvers,
  typeDefs,
});



function App(props) {
  return (
    <div className="App">
      {props.children}
    </div>
  );
}

cache.writeData({
  data: {
    isLoggedIn: !!Cookies.get('signIn'),
    cartItems: [],
  },
});

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;


function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);

  let isLoggedIn = data && data.isLoggedIn;

  return isLoggedIn ? <Pages /> : <Login />;
  // return isLoggedIn ? <Redirect to="/" /> : <Redirect to="login" />
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ApolloProvider client={client}>
    <App>
      <IsLoggedIn />
    </App>
  </ApolloProvider>
  , 
  rootElement
);
