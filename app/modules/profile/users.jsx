var React = require('react');
var UserItem = require('./user.jsx');

module.exports = React.createClass({

    getInitialState: function() {

        return {
            users: [
                {
                    id: 1,
                    name: 'Redoine'
                },
                {
                    id: 2,
                    name: 'Kevin'
                }
            ]
        };

    },



    componentDidMount: function() {


        io.socket.get('http://localhost:1337/user', function(data){

            this.setState({ users: data });

        }.bind(this));


        io.socket.on('user', function(data) {

            console.log('got new event');

        });


    },


    render: function() {

        console.log(this.state.users);
        var userItems = this.state.users.map(function (user) {
            return (
                <UserItem firstName={user.firstName} key={user.id} />
            );
        });

        
        return (
            <div class="parent">
                {userItems}
            </div>
        );


    }

});






