import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import Logout from "./pages/logout";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route path='/register' component={Register} />
                        <Route path='/dashboard' component={Dashboard} />
                        <Route path='/users' component={Users} />
                        <Route path='/logout' component={Logout} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
