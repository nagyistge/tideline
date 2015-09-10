var _ = require('lodash');

var constants = require('./constants');

module.exports = {
  bgDistribution: function(data, bgClasses) {
    
  },
  infusionSiteHistory: function(basicsData) {
    var countInfusionSitesPerDay = basicsData.data.deviceEvent.countByDate;
    var allDays = basicsData.days;
    var infusionSiteHistory = {};
    var daysSince = 0;
    _.each(allDays, function(day) {
      if (day.type === 'future') {
        infusionSiteHistory[day.date] = {type: 'future'};
      }
      else {
        daysSince += 1;
        if (countInfusionSitesPerDay[day.date] >= 1) {
          infusionSiteHistory[day.date] = {type: constants.SITE_CHANGE, daysSince: daysSince};
          daysSince = 0;
        }
        else {
          infusionSiteHistory[day.date] = {type: constants.NO_SITE_CHANGE};
        }
      }
    });
    return infusionSiteHistory;
  }
};