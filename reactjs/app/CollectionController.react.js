var React = require('react');
var ListStore = require('./stores/ListStore');
var ButtonAction = require('./actions/ButtonActions');
var MyButton = require('./Button.react');

var MyButtonController = React.createClass({
	getInitialState: function() {
		return {
			items: ListStore.getAll()
		}
	},

	componentDidMount: function() {
		ListStore.addChangeListener(this._onchange);
	},

	componentWillUnmount: function() {
		ListStore.removeChangeListener(this._onchange);
	},

	_onchange: function() {
		this.setState({
			items: ListStore.getAll()
		})
	},

	createNewItem: function(event) {
		ButtonActions.addNewItem('new item');
	},

	render: function() {
		return <MyButton 
			items={this.state.items}
			onClick={this.createNewItem}
		/>
	}
})

module.exports = MyButtonController;