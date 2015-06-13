var React = require('react');

var UserItem = React.createClass({

    render: function() {

        return (

            <li>
               <p>{this.props.firstName}</p>
            </li>

        );

    }

});

module.exports = UserItem;


