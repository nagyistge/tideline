/** @jsx React.DOM */
/* 
 * == BSD2 LICENSE ==
 * Copyright (c) 2015 Tidepool Project
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
 * == BSD2 LICENSE ==
 */

var _ = require('lodash');
var React = require('react');

var constants = require('../../logic/constants');
var Infusion = require('../sitechange/Infusion');
var NoInfusion = require('../sitechange/NoInfusion');

var SiteChange = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    date: React.PropTypes.string.isRequired
  },
  render: function() {
    var value = this.getValue();
    var siteChangeComponent = 
      ( value.type === constants.SITE_CHANGE) ?
        <Infusion daysSince={value.daysSince} /> :
        <NoInfusion />;
    return (
      <div className='SiteChange'>
        {siteChangeComponent}
      </div>
    );
  },
  getValue: function() {
    return this.props.data.infusionSiteHistory[this.props.date];
  }
});

module.exports = SiteChange;