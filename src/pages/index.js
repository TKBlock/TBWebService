import React, { Fragment } from 'react';

import Paperbase from '../components/Paperbase'

import { Router } from "@reach/router";

import { DojoInfo, Students, Instructors, Assosiations, Settings, Cert, Courses } from "./dojo"
import { AssnInfo, Settings as AssnSetting, Dojos, AprvCert } from './assn';

import gql from 'graphql-tag';
import Cookies from 'js-cookie';

export const SHOW_MODAL = gql`
    query showModal {
        showModal @client {
            isShow
            message
        }
    }

`

export default function Pages() {

    const user = JSON.parse(Cookies.get("signIn"));

    console.log(user.account_type);



    function RouterByType() {
        if(user.account_type === 1) {
            return (
                <Router primary={false} component={Fragment}>
                    <AssnSetting path="settings" />
                    <AssnInfo path="/" />
                    <Dojos path="dojos" />
                    <AprvCert path="auth_cert" />
                </Router>
            )
        } else {
            return (
                <Router primary={false} component={Fragment}>
                    <Students path="students" />
                    <Courses path="courses" />
                    <Cert path="cert" />
                    <Instructors path="instructors" />
                    <Assosiations path="assosications" />
                    <Settings path="settings" />
                    <DojoInfo path="/" />
                </Router>
            )
        }

    }


  return (
   
    <Paperbase
        accountType={user.account_type}
    >
        <RouterByType />
    </Paperbase>
  );
}
