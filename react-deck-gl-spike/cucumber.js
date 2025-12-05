export default {
  default: {
    format: ['progress', 'html:reports/cucumber-report.html'],
    paths: ['features/**/*.feature'],
    forceExit: true,
  },
};
