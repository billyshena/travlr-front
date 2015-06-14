var React = require('react');

var Header = React.createClass({

	getInitialState: function() {
        return {
            loggedIn: auth.loggedIn()
        };
    },

  render: function() {
    return(
          {this.state.loggedIn ? (
            <Link to="/logout">Log out</Link>
          ) : (
            <Link to="/login">Sign inn</Link>
          )}
          <header><div>Hello Worldd</div></header>
  	);
  }

});

module.exports = Header;