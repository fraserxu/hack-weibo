/** @jsx React.DOM */
'use strict';

var React = require('react');
var Feed = require('./feed');
var weibo = require('./weibo');
var ls = global.localStorage;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      feeds: []
    };
  },

  getFeeds: weibo.getTimeline,

  componentWillMount: function() {
    if(this.props.loggedIn) {
      this.getFeeds(ls.getItem('weibo-access-token'), function(err, feeds) {
      this.setState({
          feeds: feeds
        });
      }.bind(this));
    }

  },

  render: function() {
    return (
      <div className='container content'>
        <Feed feeds={this.state.feeds} profile={this.props.profile}/>
      </div>
    );
  }
});
