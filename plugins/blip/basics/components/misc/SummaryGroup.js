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
var classnames = require('classnames');
var d3 = require('d3');
var React = require('react');

var basicsActions = require('../../logic/actions');

var SummaryGroup = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    noDays: React.PropTypes.number.isRequired,
    selectedSubtotal: React.PropTypes.string.isRequired,
    selectorOptions: React.PropTypes.array.isRequired,
    sectionId: React.PropTypes.string.isRequired
  },
  render: function() {
    var self = this;

    var primaryOption = _.find(self.props.selectorOptions, { primary: true });
    var primaryElem = null;
    if (primaryOption) {
      primaryElem = this.renderInfo(primaryOption);

      if (!self.props.selectedSubtotal) {
        self.props.selectedSubtotal = primaryOption.key;
      }
    }

    var otherOptions = _.filter(
      self.props.selectorOptions,
      function(row) {
        return !row.primary;
      }
    );

    var others = otherOptions.map(self.renderInfo);

    return (
      <div className="SummaryGroup-container">
        {primaryElem}
        <div className="SummaryGroup-info-others">
          {others}
        </div>
      </div>
    );
  },
  renderInfo: function(option) {
    if (typeof option.active !== 'undefined' && !option.active) {
      return (<div key={option.key} className='SummaryGroup-info SummaryGroup-info-blank'></div>);
    }

    var classes = classnames({
      'SummaryGroup-info--selected': (option.key === this.props.selectedSubtotal),
      'SummaryGroup-info-primary': option.primary,
      'SummaryGroup-info-primary--average': option.primary && option.average,
      'SummaryGroup-info': !option.primary,
    	'SummaryGroup-info-tall': ( !option.primary && this.props.selectorOptions.length <= 4 ),
    	'SummaryGroup-no-percentage': ( !option.primary && !option.percentage )
    });

    var path = option.path;

    var value;
    if (option.key === 'total') {
      if (path) {
        value = this.props.data[path].total;
      }
      else {
        value = this.props.data[option.key];
      }
    }
    else {
      if (path && path === option.key) {
        value = this.props.data[path].total;
      }
      else if (path) {
        value = this.props.data[path][option.key].count;
      }
      else {
        value = this.props.data[option.key].count || 0;
      }
    }

    var percentage;
    if (option.percentage) {
      if (path) {
        percentage = this.props.data[path][option.key].percentage;
      }
      else {
        percentage = this.props.data[option.key].percentage;
      }
    }
    
    if (option.primary && option.average) {
      var average = Math.round(value/this.props.noDays);
      var averageElem = (
        <span className="SummaryGroup-option-count">
          {average}
        </span>
      );

      var totalElem = (
        <span className="SummaryGroup-option-total">
          <span>Total:</span>
          {value}
        </span>
      );


      return (
        <div key={option.key} className={classes}
          onClick={this.handleSelectSubtotal.bind(null, option.key)}>
          <span className="SummaryGroup-option-label">{option.label}</span>
          {averageElem}
          {totalElem}
        </div>
      );
    } else {
      var valueElem = (
        <span className="SummaryGroup-option-count">
          {value}
        </span>
      );
      var percentageElem = (option.percentage) ? (
        <span className="SummaryGroup-option-percentage">
          {d3.format('%')(percentage)}
        </span>
      ) : null;

      return (
        <div key={option.key} className={classes}
          onClick={this.handleSelectSubtotal.bind(null, option.key)}>
          <span className="SummaryGroup-option-label">{option.label}</span>
          {percentageElem}
          {valueElem}
        </div>
      );
    }
  },
  handleSelectSubtotal: function(selectedSubtotal) {
    basicsActions.selectSubtotal(this.props.sectionId, selectedSubtotal);
  }
});

module.exports = SummaryGroup;
