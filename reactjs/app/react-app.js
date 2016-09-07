var React = require('react');
var reactDOM = require('react-dom');
var Collection = require('./collection.react');

var HelloMessage = React.createClass({
	getInitialState: function() {
		return {
			isHidden: true,
			title: 1
		};
	},
	handleClick: function() {
		this.setState({
			isHidden: !this.state.isHidden,
			title: ++this.state.title
		})
	},
	render: function(){
		var headerElement = React.createElement('h1', {className: 'header', key: 'header'}, this.state.title);
		var buttonElement = React.createElement('button', {key: 'button', onClick: this.handleClick}, 'Toggle header name');
		var testElement = React.createElement('div', {key: 'test'}, <Collection />);
		if(this.state.isHidden) {
			return React.createElement('div', null, [buttonElement, testElement]);
		}
		return React.createElement('div', null, [buttonElement, headerElement]);
	}
});


reactDOM.render(
	<HelloMessage name="bobo" />,
	document.querySelector('#example')
)

