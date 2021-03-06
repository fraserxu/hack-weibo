/** @jsx React.DOM */
'use strict';

var React = require('react');
var Comments = require('./Comments');
var Timestamp = require('react-time');
var WeiboAPI = require('../utils/WeiboAPI');
var ReTweet = require('./ReTweet');
var Spinner = require('react-spinner');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      comments: [],
      commentsLoaded: false,
      isImgScaled: false,
      commentOpen: false
    };
  },

  destroyStatus: function() {
    WeiboAPI.destroyStatus(this.props.feed.id, function(err, data) {
      console.log('destroy', data)
    })
  },

  loadComments: function(e) {
    e.preventDefault();

    this.setState({
      commentOpen: !this.state.commentOpen
    })
    WeiboAPI.loadComments(this.props.feed.id, function(err, data) {
      if(!err) {
        this.setState({
          comments: data,
          commentsLoaded: true
        })
      }
    }.bind(this))
  },

  scaleImg: function() {
    var img = this.refs.thumbnail_pic.getDOMNode();
    this.setState({
      isImgScaled: !this.state.isImgScaled
    })
    if (!this.state.isImgScaled) {
      img.className = 'scaled'
      img.src = this.props.feed.original_pic;
    } else {
      img.className = ''
      img.src = this.props.feed.thumbnail_pic;
    }
  },

  render: function() {
    var thumbnail = this.props.feed.thumbnail_pic ?
      <img ref='thumbnail_pic' onClick={this.scaleImg} src={this.props.feed.thumbnail_pic} alt={this.props.feed.text} /> : null

    // var deleteButton = this.props.profile.name == this.props.feed.user.name ?
    //   <button className="delete-btn" onClick={this.destroyStatus}>Delete</button> : null

    var retweet = this.props.feed.retweeted_status ?
      <ReTweet retweeted_status={ this.props.feed.retweeted_status } /> : null

    var parsedText;
    var URL_REGEX = new RegExp("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))", "g")
    var urls = this.props.feed.text.match(URL_REGEX)

    if(urls) {
      urls.forEach(function(url) {
        url = url.trim()
        parsedText = this.props.feed.text.replace(url, '<a target="_blank" href="'+ url + '">' + url + '</a>')
      }.bind(this))
    } else {
      parsedText = this.props.feed.text
    }

    return (
      <article className='post'>

        <div className='post-avatar'>
          <span className='avatar-container'>
            <img src={this.props.feed.user.profile_image_url} alt={this.props.feed.user.name} />
          </span>
        </div>

        <div className='post-content'>
          <p dangerouslySetInnerHTML={{__html: parsedText}} />
          {thumbnail}
          {retweet}
        </div>

        <div className='postbar'>
          <Timestamp value={new Date(this.props.feed.created_at)} relative />
          <span className='like-count'>Like ({this.props.feed.attitudes_count})</span>
          <span className='reposts-count'>Reposts ({this.props.feed.reposts_count})</span>
          <span className='comments-count'>Comment (<a href='#' onClick={this.loadComments}>{this.props.feed.comments_count}</a>)</span>
        </div>

        {this.state.commentOpen && !this.state.commentsLoaded ?
          <Spinner /> : null
        }

        {this.state.commentOpen && this.state.commentsLoaded ?
          <Comments feed={this.props.feed} comments={this.state.comments} /> : null
        }
      </article>
    )
  }
});