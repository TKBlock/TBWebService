import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    showModal: ModalMessage!
  }

  extend type ModalMessage {
    isShow: Boolean!
    message: String!   
  }
`;

export const resolvers = {

};
