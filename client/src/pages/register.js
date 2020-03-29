import React, { Component } from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';

export default class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        authError: false,
        isLoading: false,
        receivedErrors:{}
    };

    handleEmailChange = event => {
        this.setState({ email: event.target.value });
    };
    handlePwdChange = event => {
        this.setState({ password: event.target.value });
    };
    handleCPwdChange = event => {
        this.setState({ confirm_password: event.target.value });
    };
    handleNameChange = event => {
        this.setState({ name: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({isLoading: true, receivedErrors: {}});
        const url = 'http://localhost:5000/api/users/register';
        const email = this.state.email;
        const password = this.state.password;
        const confirm_password = this.state.confirm_password;
        const name = this.state.name;

        axios.post(url, `name=${name}&email=${email}&password=${password}&confirm_password=${confirm_password}`)
            .then(result => {
                this.setState({isLoading: false});
                if(result.data.status === 0){
                    this.setState({receivedErrors: result.data.errors});
                }else if(result.data.status === 1){
                    this.props.history.push("/");
                }
            })
            .catch(error => {
                this.setState({ authError: true, isLoading: false });
            });
    };

    renderRedirect = () => {
        // if (this.state.redirect) {
        if(localStorage.getItem('isLoggedIn')){
            return <Redirect to="/dashboard" />
        }
    };

    render() {
        const isLoading = this.state.isLoading;
        return (
            <div className="container">
                <div className="card card-login mx-auto mt-5">
                    <div className="card-header">Register</div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <div className="form-label-group">
                                    <input type="text" id="inputName" className={"form-control " + (this.state.receivedErrors['name'] ? 'is-invalid' : '')} placeholder="name"  name="name" onChange={this.handleNameChange} required/>
                                    <label htmlFor="inputName">Name</label>
                                    <div className="invalid-feedback">
                                        {this.state.receivedErrors['name']}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-label-group">
                                    <input id="inputEmail" className={"form-control " + (this.state.receivedErrors['email'] ? 'is-invalid' : '')} placeholder="Email address" type="text" name="email" onChange={this.handleEmailChange} required/>
                                    <label htmlFor="inputEmail">Email address</label>
                                    <div className="invalid-feedback">
                                        {this.state.receivedErrors['email']}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-label-group">
                                    <input type="password" className={"form-control " + (this.state.receivedErrors['password'] ? 'is-invalid' : '')} id="inputPassword" placeholder="******"  name="password" onChange={this.handlePwdChange} required/>
                                    <label htmlFor="inputPassword">Password</label>
                                    <div className="invalid-feedback">
                                        {this.state.receivedErrors['password']}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-label-group">
                                    <input type="password" className={"form-control " + (this.state.receivedErrors['confirm_password'] ? 'is-invalid' : '')} id="inputPassword" placeholder="******"  name="confirm_password" onChange={this.handleCPwdChange} required/>
                                    <label htmlFor="inputPassword">Confirm Password</label>
                                    <div className="invalid-feedback">
                                        {this.state.receivedErrors['confirm_password']}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Register &nbsp;&nbsp;&nbsp;
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span></span>
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="text-center">
                            <Link className="d-block small mt-3" to={''}>Login Your Account</Link>
                        </div>
                    </div>
                </div>
                {this.renderRedirect()}
            </div>
        );
    }
}


