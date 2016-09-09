// var React = require('react');

var MyButton = React.createClass({
	getInitialState: function() {
		var items = this.props.items;
		console.log(this.props)
	 	var itemHtml = items.map(function (listItem, i) {
	    	return <li key={i}>{listItem}</li>;
	  	});
	},
	render: function() {
		return <div>
		    <ul>{itemHtml}</ul>
		    <button onClick={props.onClick}>New Item</button>
		</div>;
	}
})


module.exports = MyButton;