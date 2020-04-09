import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Paper, TextField, Button, Grid, ButtonGroup } from '@material-ui/core';
import { navigate } from "@reach/router";
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import Cookies from 'js-cookie';
import logo from '../assets/images/logo@3x.png';

import gql from 'graphql-tag';


export const LOGIN = gql`
    mutation signUp(
        $email: String!, 
        $password: String!
    ) {
        signUp(
            email: $email, 
            password: $password
        ) {
            token
            uuid
            email
            account_type
            status
            message
        }
    }
`

const styles = {
    app: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',

        width: 681,
        height: 494,
        margin: 'auto',
        overflow: 'hidden',
        alignItems: 'center',
        
    },
    logo: {
        margin: '35px 0 20px',
        width: 319,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',

        alignItems: 'center',
        margin: '0 0 37px'
    },
    textField: {
        width: 342
    },
    button: {
       margin: '20px 0',
       width: 127,
       height: 50
    },
    textButton: {
        width: 170,
        color: 'black'
    }
};
  


function LoginForm(props) {
    const client = useApolloClient();

    const { classes } = props;
    const [login] = useMutation(LOGIN, {
        onCompleted({signUp}) {
            console.log(signUp)

            if(signUp.status != 200) {
                alert("error")
                return;
            }


            Cookies.set('signIn', signUp);
            client.writeData({ data: { isLoggedIn: true } })

            // navigate('/');
        }
    })


    const onSubmit = (event) => {
        event.preventDefault();
        console.log("onSubmit");

        // Cookies.set('login', { data: "dummy"});
        // client.writeData({
        //     data: {
        //         isLoggedIn: true
        //     },
        // });
        // return navigate("/")

        let args = {
            email: event.target.email.value,
            password: event.target.password.value,
        }

        login({ variables: args });
    }
    
    const btnSignin = () => {
        return navigate("signin");
    }

    return (
        <div className={classes.root}>
            <Paper
                className={classes.paper} 
                elevation={3}
            >
                <img src={logo} className={classes.logo} />
                <form 
                    className={classes.form}

                    autoComplete="off"
                    onSubmit={onSubmit}
                >
                    <TextField
                        id="outlined-basic"
                        className={classes.textField}
                        label="이메일을 입력하세요"
                        name="email"
                        variant="outlined"
                        margin="normal"
                        // defaultValue="test@test.com"
                    />
                    <TextField
                        id="outlined-basic"
                        type="password"
                        className={classes.textField}
                        label="비밀번호를 입력하세요"
                        variant="outlined"
                        name="password"
                        margin="normal"
                        // defaultValue="1234qwer" 
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        className={classes.button}
                    >
                        로그인 하기
                    </Button>
                </form>
                <Grid item xs={12} md={12}>
                    <Grid item>
                        <ButtonGroup
                            variant="text"
                            color="primary"
                            aria-label="full-width contained primary button group"
                            >
                            <Button className={classes.textButton} onClick={btnSignin} >가입하기</Button>
                            <Button className={classes.textButton} >이메일 찾기</Button>
                            <Button className={classes.textButton} >비밀번호 찾기</Button>
                        </ButtonGroup>                   
                    </Grid>
                </Grid>
                  
            </Paper>
        </div>
    )
}

export default withStyles(styles)(LoginForm);