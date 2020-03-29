import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import TitleComponent from "./title";

export default class Users extends Component {

    state = {
        userData : {}
    };

    componentDidMount() {
        /*Get user data*/

        const url = 'http://localhost:5000/api/users/dashboard';
        let headers = {
            "x-access-token" : localStorage.getItem('token')
        };
        axios.get(url, {headers:headers}).then(result => {
            if(result.data.status === 1){
                this.setState({userData:result.data.data});
            }else{
                localStorage.clear();
            }
        });
        const list_url = 'http://localhost:5000/api/users/list';
        axios.get(list_url, {headers:headers}).then(result => {
            if(result.data.status === 1){
                this.setState({usersList:result.data.data});
            }else{
                localStorage.clear();
            }
        });
    };

    renderRedirect = () => {
        if(!localStorage.getItem('isLoggedIn')){
            return <Redirect to="/" />
        }
    };

    render() {
        var users = (this.state.usersList) ? this.state.usersList : [];
        var tr_key = 0;
        return (
            <div className="container">
                <TitleComponent title="React Dashboard"></TitleComponent>
                <div className="card mx-auto mt-5">
                    <div className="card-header">
                        (Role: {this.state.userData.role})
                        | <Link to={'dashboard'}>Dashboard</Link>

                         {this.state.userData.role === 'admin' ? (<span> | <Link to={'users'}> Users List </Link> </span>) : '' } 
                         | <Link to={'logout'}>Logout</Link>

                    </div>
                    <div className="card-body">
                        <table className="table">
                        <tbody>
                        <tr><th>Name</th><th>Email</th></tr>
                        {
                            users.map(({name, email}) => (
                                <tr key={tr_key++}><td>{name}</td><td>{email}</td></tr>
                            ))
                        }
                        
                        </tbody>
                        </table>
                        <div className="text-center"></div>
                    </div>
                </div>
                {this.renderRedirect()}
            </div>
        );
    }
}
