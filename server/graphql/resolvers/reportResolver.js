const Report = require('../../models/Report');

module.exports = {
  Mutation: {
    report: async (root, { report }, { userId }) => {
      if (userId) report.by = userId;
      await new Report(report).save();
      return true;
    },
  },
};
