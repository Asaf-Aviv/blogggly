const { gql } = require('apollo-server-express');

module.exports = gql`
  type Mutation {
    report(report: ReportInput!): Boolean!
  }

  type Report {
    reportedId: ID!
    type: String!
    reason: String!
    by: ID
    date: String!
  }

  input ReportInput {
    reportedId: ID!
    type: String!
    reason: String!
  }
`;
