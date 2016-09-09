//
// var React = require('react');
var CollectionController = require('./CollectionController.react');

var HelloMessage = React.createClass({
	getInitialState: function() {
		return {
			isHidden: true,
			title: 'default title',
			board: 'default display'
		};
	},
	handleClick: function() {
		this.setState({
			isHidden: !this.state.isHidden,
		})
	},
	setMessage: function(info) {
		this.setState({
			board: info
		})
	},
	getMessage: function() {
		return this.state.board
	},
	render: function(){
		var headerElement = React.createElement('h1', {className: 'header', key: 'header'}, this.state.title);
		var buttonElement = React.createElement('button', {key: 'button', onClick: this.handleClick}, 'Toggle header name');
		if(this.state.isHidden) {
			return <div>
				{buttonElement}
				{headerElement}
				<CollectionController />
			</div>
		}
		return <div>
			{buttonElement}
			{headerElement}
			<CollectionController />
		</div>
	}
});

module.exports = HelloMessage;