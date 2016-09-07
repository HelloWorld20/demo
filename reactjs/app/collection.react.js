var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var Collection = React.createClass({
	getInitialState: function() {
		return {
			title: 'title of collection.react.js',
			message: 'default message'
		}
	},
	clickAndAlert: function() {
		var that = this;
		$.ajax({
			type: 'get',
			url: 'http://localhost:3000/demo/demo/reactjs/source/test.json',
			dataType: 'json',
			success: function(res) {
				that.setState({
					message: res.key
				})
			}
		})
	},
	render: function() {
		return <div>
			<a href="#">{this.state.message}#</a>
			<h3 onClick={this.clickAndAlert}>{this.state.title}</h3>
		</div>;
	}
})

module.exports = Collection;