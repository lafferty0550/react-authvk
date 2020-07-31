import React, {Component} from 'react';
import Spinner from 'react-spinners/ClipLoader';

import api from '../api';

import UserPage from '../components/user.js';

import './app.css';

export default class extends Component {
    constructor(props) {
        super(props);
        const userInfo = JSON.parse(localStorage.getItem('user')) || {};
        this.state = {
            account: {pending: false, success: true, userInfo},
            userFriends: {pending: false, success: true, data: []},
            isAuth: (Object.keys(userInfo).length !== 0)
        };
    }

    componentDidMount() {
        if (this.state.isAuth)
            this.getFriends();
    }

    getFriends() {
        this.setState(state => ({userFriends: {...state.userFriends, pending: true}}));
        api.getFriends(5, r => {
            if (!r.error)
                this.setState({
                    userFriends: {pending: false, success: true, data: r.response.items}
                });
            else
                this.setState({
                    userFriends: {pending: false, success: false, data: []}
                });
        });
    }

    login() {
        this.setState(state => ({account: {...state.account, pending: true}}));
        api.login(r => {
            if (r.session) {
                this.setState({
                    account: {pending: false, success: true, userInfo: r.session.user},
                    isAuth: true
                }, this.getFriends);
                localStorage.setItem('user', JSON.stringify(r.session.user));
            } else
                this.setState({
                    account: {success: false, pending: false, userInfo: {}}
                });
        })
    }

    logout() {
        window.VK.Auth.logout();
        localStorage.removeItem('user');
        this.setState({
            account: {pending: false, success: true, userInfo: {}},
            userFriends: {pending: false, success: true, data: []},
            isAuth: false
        });
    }

    render() {
        const {account, userFriends, isAuth} = this.state;

        return (
            <div className="app">
                {!isAuth
                    ? (
                        <>
                            <svg className="logo" viewBox="0 0 511.962 511.962" onClick={this.login.bind(this)}>
                                <path d="M250.503,400.807h30.592c0,0,9.248-1.024,13.952-6.112c4.352-4.672,4.192-13.44,4.192-13.44
                                    s-0.608-41.056,18.464-47.104c18.784-5.952,42.912,39.68,68.48,57.248c19.328,13.28,34.016,10.368,34.016,10.368l68.384-0.96
                                    c0,0,35.776-2.208,18.816-30.336c-1.376-2.304-9.888-20.8-50.848-58.816c-42.88-39.808-37.12-33.344,14.528-102.176
                                    c31.456-41.92,44.032-67.52,40.096-78.464c-3.744-10.432-26.88-7.68-26.88-7.68l-76.928,0.448c0,0-5.696-0.768-9.952,1.76
                                    c-4.128,2.496-6.784,8.256-6.784,8.256s-12.192,32.448-28.448,60.032c-34.272,58.208-48,61.28-53.6,57.664
                                    c-13.024-8.416-9.76-33.856-9.76-51.904c0-56.416,8.544-79.936-16.672-86.016c-8.384-2.016-14.528-3.36-35.936-3.584
                                    c-27.456-0.288-50.72,0.096-63.872,6.528c-8.768,4.288-15.52,13.856-11.392,14.4c5.088,0.672,16.608,3.104,22.72,11.424
                                    c7.904,10.72,7.616,34.848,7.616,34.848s4.544,66.4-10.592,74.656c-10.4,5.664-24.64-5.888-55.2-58.72
                                    c-15.648-27.04-27.488-56.96-27.488-56.96s-2.272-5.568-6.336-8.544c-4.928-3.616-11.84-4.768-11.84-4.768l-73.152,0.448
                                    c0,0-10.976,0.32-15.008,5.088c-3.584,4.256-0.288,13.024-0.288,13.024s57.28,133.984,122.112,201.536
                                    C182.983,404.871,250.503,400.807,250.503,400.807L250.503,400.807z"/>
                            </svg>
                            {!account.pending && !account.success && <div className='error-text'>Error while auth</div>}
                            {account.pending && <Spinner/>}
                        </>
                    )
                    : (
                        <>
                            <svg className="logo" viewBox="0 0 512 512" onClick={this.logout.bind(this)}>
                                <path d="M255.15,468.625H63.787c-11.737,0-21.262-9.526-21.262-21.262V64.638c0-11.737,9.526-21.262,21.262-21.262H255.15
                                    c11.758,0,21.262-9.504,21.262-21.262S266.908,0.85,255.15,0.85H63.787C28.619,0.85,0,29.47,0,64.638v382.724
                                    c0,35.168,28.619,63.787,63.787,63.787H255.15c11.758,0,21.262-9.504,21.262-21.262
                                    C276.412,478.129,266.908,468.625,255.15,468.625z"/>
                                <path d="M505.664,240.861L376.388,113.286c-8.335-8.25-21.815-8.143-30.065,0.213s-8.165,21.815,0.213,30.065l92.385,91.173
                                    H191.362c-11.758,0-21.262,9.504-21.262,21.262c0,11.758,9.504,21.263,21.262,21.263h247.559l-92.385,91.173
                                    c-8.377,8.25-8.441,21.709-0.213,30.065c4.167,4.21,9.653,6.336,15.139,6.336c5.401,0,10.801-2.041,14.926-6.124l129.276-127.575
                                    c4.04-3.997,6.336-9.441,6.336-15.139C512,250.302,509.725,244.88,505.664,240.861z"/>
                            </svg>
                            <UserPage user={account.userInfo} userFriends={userFriends.data}/>
                            {!userFriends.pending && !userFriends.success && <div className='error-text'>Error while getting friend list</div>}
                            {userFriends.pending && <Spinner/>}
                        </>
                    )}
            </div>
        )
    }
}