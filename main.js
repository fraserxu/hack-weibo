/** @jsx React.DOM */
'use strict';

var React = require('react');
var ls = global.localStorage;
// var axios = require('axios');
var Header = require('./components/header');
var Status = require('./components/status');
var jsonp = require('jsonp');

require('./css/typography.css')
require('./css/styles.css')

var APP = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: false
    };
  },
  componentWillMount: function() {
    this.checkLogin()

    var accessToken = window.location.search.replace('?accessToken=', '')
    if(accessToken) {
      ls.setItem('weibo-access-token', accessToken)
      this.setLogin(true)
    }
  },

  checkLogin: function() {
    if(ls.getItem('weibo-access-token')) {
      this.getUser()
      this.setLogin(true)
    }
  },

  setLogin: function(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    })
  },

  getUser: function(fn) {
    var uid_url = 'https://api.weibo.com/2/account/get_uid.json?access_token=2.00YwP8sBGoDixB537b1199b20i7RQn';
    // var user_url = 'https://api.weibo.com/2/users/show.json?access_token=2.00YwP8sBGoDixB537b1199b20i7RQn&uid=' + uid
    jsonp(uid_url, function(err, res) {
      console.log('res', res)
    }.bind(this))
  },

  render: function() {
    return (
      <div>
        <Header loggedIn={this.state.loggedIn} />
        <Status />
      </div>
    );
  }
});

React.renderComponent(<APP />, document.body);