import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import TitleComponent from "./title";

export default class Dashboard extends Component {

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
        })
    };

    renderRedirect = () => {
        if(!localStorage.getItem('isLoggedIn')){
            return <Redirect to="/" />
        }
    };

    render() {
        return (
            <div className="container">
                <TitleComponent title="React Dashboard"></TitleComponent>
                <div className="card mx-auto mt-5">
                    <div className="card-header">
                        (Role: {this.state.userData.role})
                        | <Link to={'dashboard'}> Dashboard </Link> 

                         {this.state.userData.role === 'admin' ? (<span> | <Link to={'users'}> Users List </Link> </span>) : '' } 
                          | <Link to={'logout'}> Logout </Link>

                    </div>
                    <div className="card-body">
                        <table className="table">
                        <tbody>
                        <tr><th>Name</th><td>{this.state.userData.name}</td></tr>
                        <tr><th>Email</th><td>{this.state.userData.email}</td></tr>
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
