/**
 * Copyright (c) 2014, Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

var bows = window.bows;

var tideline = require('../js');

var fill = tideline.plot.util.fill;

// Create a 'Two Weeks' chart object that is a wrapper around Tideline components
function chartWeeklyFactory(el, options, emitter) {
  var log = bows('Weekly Factory');
  options = options || {};

  var chart = tideline.twoWeek(el, emitter);
  chart.emitter = emitter;

  var pools = [];

  var create = function(el, options) {
    // basic chart set up
    chart.width($(el).width()).height($(el).height());

    if (options.imagesBaseUrl) {
      chart.imagesBaseUrl(options.imagesBaseUrl);
    }

    d3.select(el).call(chart);

    return chart;
  };

  chart.load = function(data, datetime) {

    if (!datetime) {
      chart.data(_.where(data, {'type': 'smbg'}));
    }
    else {
      var smbgData = _.where(data, {'type': 'smbg'});
      if (datetime.valueOf() > Date.parse(smbgData[smbgData.length - 1].normalTime)) {
        datetime = smbgData[smbgData.length - 1].normalTime;
      }
      chart.data(smbgData, datetime);
    }

    chart.setup();

    days = chart.days;

    // make pools for each day
    days.forEach(function(day, i) {
      var newPool = chart.newPool()
        .id('poolBG_' + day, chart.daysGroup())
        .index(chart.pools().indexOf(newPool))
        .weight(1.0);
    });

    chart.setAxes().setNav().setScrollNav();

    chart.arrangePools();

    var fillEndpoints = [new Date('2014-01-01T00:00:00Z'), new Date('2014-01-02T00:00:00Z')];
    var fillScale = d3.time.scale.utc()
      .domain(fillEndpoints)
      .range([chart.axisGutter(), chart.width() - chart.navGutter()]);

    var smbgTime = new tideline.plot.SMBGTime({emitter: emitter});

    chart.pools().forEach(function(pool, i) {
      pool.addPlotType('fill', fill(pool, {
        endpoints: fillEndpoints,
        xScale: fillScale,
        gutter: 0.5
      }), false);
      pool.addPlotType('smbg', smbgTime.draw(pool), true);
      pool.render(chart.daysGroup(), chart.dataPerDay[i]);
    });

     emitter.on('numbers', function(toggle) {
      if (toggle === 'show') {
        smbgTime.showValues();
      }
      else if (toggle === 'hide') {
        smbgTime.hideValues();
      }
    });

    return chart;
  };

  return create(el, options);
}

module.exports = chartWeeklyFactory;