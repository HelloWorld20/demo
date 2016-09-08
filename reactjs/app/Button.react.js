var React = require('react');

var MyButton = React.createClass({
	
	render: function() {
		var items = this.props.items;
		console.log(this.props)
	 	var itemHtml = items.map(function (listItem, i) {
	    	return <li key={i}>{listItem}</li>;
	  	});
		return <div>
			<h1>MyButton</h1>
		    <ul>{itemHtml}</ul>
		    <button onClick={this.props.onClick}>New Item</button>
		</div>;
	}
})


module.exports = MyButton;