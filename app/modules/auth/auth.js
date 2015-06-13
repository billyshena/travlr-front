/**
 * Created by bshen on 13/06/15.
 */
module.exports = {

    login (email, pass, cb) {

        var self = this;
        cb = arguments[arguments.length - 1];

        if (localStorage.token) {
            if (cb) cb(true);
            self.onChange(true);
            return;
        }

        pretendRequest(email, pass, function(res) {

            if (res.authenticated) {
                localStorage.token = res.token;
                if (cb) cb(true);
                self.onChange(true);
            }
            else {
                if (cb) cb(false);
                self.onChange(false);
            }

        });

    },

    getToken: function () {
        return localStorage.token;
    },

    logout: function (cb) {
        delete localStorage.token;
        if (cb) cb();
        this.onChange(false);
    },

    loggedIn: function () {
        return !!localStorage.token;
    },

    onChange: function () {
        return console.log('ok');
    }
};

function pretendRequest(email, pass, cb) {
    console.log('pretend');
    setTimeout(function() {
        if (email === 'joe@example.com' && pass === 'password1') {
            cb({
                authenticated: true,
                token: Math.random().toString(36).substring(7)
            });
        } else {
            cb({authenticated: false});
        }
    }, 0);
}


