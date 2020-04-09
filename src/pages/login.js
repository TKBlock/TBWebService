import React, { Fragment } from 'react';


import { Router } from "@reach/router";

import LoginForm from '../components/loginForm';
import SignIn from './signin';

import { ThemeProvider } from '@material-ui/styles';
import theme from '../assets/theme/paperbase'

export default function Login() {
 
    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <Router>
                    <LoginForm path="/" />
                    <SignIn path="/signin" />
                </Router>                
            </ThemeProvider>
        </Fragment>
    );
}
  