var React = require('react');
var Header = require('./modules/header/header.jsx');

/* React Router components */
var Router = require('react-router');
var Route = Router.Route;
var HashHistory = Router.History;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navigation = Router.Navigation;
var DefaultRoute = Router.DefaultRoute;

/* Custom components */
var TransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var auth = require('./modules/auth/auth.js');


var App = React.createClass({
    getInitialState: function() {
        return {
            loggedIn: auth.loggedIn()
        };
    },

    setStateOnAuth: function(loggedIn) {
        this.setState({
            loggedIn: loggedIn
        });
    },

    componentWillMount: function() {
        auth.onChange = this.setStateOnAuth;
        auth.login();
    },

    render: function() {
        return (
            <div>
                <Header/>
                <RouteHandler/>
            </div>
        );
    }
});

var Home = React.createClass({

    render: function() {
        return <h1>Homeee</h1>;
    }

});

var Dashboard = React.createClass({

    mixins: [ Navigation ],

    statics: {

        willTransitionTo: function (transition, params, query, callback) {
            requireAuth(transition);
            callback();
        }
    },


    render: function() {
        console.log(this);
        var token = auth.getToken();
        return (
            <div>
                <h1>Dashboard</h1>
                <p>You made it!</p>
                <p>{token}</p>
            </div>
        );
    }
});

var Login = React.createClass({

    mixins: [ Navigation ],

    getInitialState: function() {
        return {
            error: false
        };
    },

    handleSubmit: function(event) {
        event.preventDefault();

        var email = findDOMNode(this.refs.email).value;
        var pass = findDOMNode(this.refs.pass).value;

        auth.login(email, pass, function(loggedIn) {
            if (!loggedIn)
                return this.setState({ error: true });

            var location = this.props;

            if (location.query && location.query.nextPathname) {
                this.replaceWith(location.query.nextPathname);
            } else {
                this.replaceWith('/about');
            }
        });
    },

    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label><input ref="email" placeholder="email" defaultValue="joe@example.com"/></label>
                <label><input ref="pass" placeholder="password"/></label> (hint: password1)<br/>
                <button type="submit">login</button>
                {this.state.error && (
                    <p>Bad login information</p>
                )}
            </form>
        );
    }
});

var Logout = React.createClass({
    componentDidMount: function() {
        auth.logout();
    },

    render: function() {
        return <p>You are now logged out</p>;
    }
});

function requireAuth(transition) {

    if (!auth.loggedIn()){
        console.log('not logged');
        transition.redirect('/login');
    }

}


var routes = (
    <Route path="/" handler={App}>
        <Route path="login" handler={Login}/>
        <Route path="logout" handler={Logout}/>
        <Route path="dashboard" handler={Dashboard} />
        <Route path="home" handler={Home} />
    </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});

