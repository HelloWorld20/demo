//用于展示内容的组件
// var React = require('react');

var Display = React.createClass({

	render: function() {
		return <div style={{border: 3+ 'px solid #eee'}}>
			<h2>Display</h2>
			<p>default info {this.props.getFatherMessage()}</p>
		</div>
	}
})

module.exports = Display;