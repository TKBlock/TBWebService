import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import { Paper, TextField, Button } from '@material-ui/core';
import { navigate } from "@reach/router";

import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks'

import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import theme from '../assets/theme/paperbase'
import clsx from 'clsx';

import gql from 'graphql-tag';
import Cookies from 'js-cookie';

import { IS_LOGGED_IN } from '../'

export const CREATE_USER = gql`
    mutation signIn(
        $email: String!, 
        $password: String!,
        $dojo_name: String!,
        $manager: String!,
        $address: String!,
        $images: [Upload],
        $phone: String,
        $description: String
    ) {
        signIn(
            email: $email, 
            password: $password,
            dojo_name: $dojo_name,
            manager: $manager,
            address: $address,
            images: $images,
            phone: $phone,
            description: $description
        ) {
            token
            uuid
            email
            account_type
            status
            message
        }
    }
`;

  
export const MULTIPLE_UPLOAD_MUTATION = gql`
  mutation multipleUpload($files: [Upload!]!) {
    uploadFiles(files: $files) {
        id
        filename
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
        maxWidth: 936,
        margin: 'auto',
        overflow: 'hidden',
        
    },
    logo: {
        margin: '35px 0 20px',
        width: 319,
    },
    main: {
        flex: 1,
        width: '100%',
        margin: 0,
        padding: theme.spacing(6, 4),
        background: '#eaeff1',
      },
      inputContainer: {
        display: 'flex',
        flex: 1,
      },
      inputLabel: {
          flexBasis: '20%',
          flexShrink: 0,
          textAlign: 'right',
          paddingRight: '2rem',
            alignSelf: 'center',
            paddingTop: 8
      },
      inputForm: {
        marginBottom: 20
      },
      input: {
    
      },
      inputArea: {
        flexBasis: '60%',
        textAlign: 'left'
      },
      inputFileArea: {
        borderRadius: 8,
        border: '1px solid threedface'
      },
      buttonWrapper: {
        // display: 'flex',
        // flex: 1,
        margin: '20px 0',
        flexBasis : '60%',
        textAlign: 'right'
        // justifyContent: 'flex-end'
      },
      readonly: {
          marginBottom: 8,
          marginTop: 16,
      },
      tableHead: {
        backgroundColor: 'whitesmoke'
      },
      table: {
          marginTop: 16,
          marginBottom: 8
      }
};


function LoginForm(props) {
    const client = useApolloClient();

    const { classes } = props;
    const [ fileList, setFileList ] = React.useState([]);

    // const [multipleUploadMutation] = useMutation(MULTIPLE_UPLOAD_MUTATION)
    const [createUser] = useMutation(CREATE_USER, {
        onCompleted({signIn}) {
            console.log(signIn)

            if(signIn.status != 200) {
                alert("error")
                return;
            } else {
                Cookies.set('signIn', signIn);
                client.writeData({ data: { isLoggedIn: true } })
    
                navigate('/');
            }


        }
    })

    const onFileSelect = ({ target: { validity, files } }) => {
        if(validity.valid) {

            let selectedList = [];
            
            for(let i = 0; i < 5; i++) {
                if(files[i]) {
                    selectedList.push( files[i] );
                } else {
                    break;
                }
            }

            console.log(files);
            console.log(selectedList);


            setFileList(files);

            // multipleUploadMutation({ variables: { files } })
            
        }
    }



    const onSubmit = (event) => {
        event.preventDefault();

        if( event.target.password.value !== event.target.password_confirm.value) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }

        let args = {
            email: event.target.email.value,
            password: event.target.password.value,
            dojo_name: event.target.dojo_name.value,
            manager: event.target.manager.value,
            address: event.target.address.value,
            images: fileList,
            phone: event.target.phone.value,
            description: event.target.description.value,
        }

        createUser({ variables: args })

    }

    const drawTableRow = () => {
        let selectedList = [];

        for(let i = 0; i < 5; i++) {
            if(fileList[i]) {
                selectedList.push( fileList[i] );
            } else {
                break;
            }
        }

        // if(selectedList.length == 0) {
        //     return <div></div>
        // }

        return selectedList.map(row => (
            <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                {row.name}
                </TableCell>
                <TableCell align="right">{row.size}</TableCell>
            </TableRow>
        ))
    }

    function IsLoggedIn() {
        const { data } = useQuery(IS_LOGGED_IN);
        console.log(data);

        let isLoggedIn = data && data.isLoggedIn;

        if(isLoggedIn)
            navigate('/');

        return <Fragment></Fragment>
    }

    return (
        
        <Fragment>
            <IsLoggedIn />
            <main className={classes.main}>
                <Paper className={classes.paper}>
                <div className={classes.contentWrapper}>
        
                <form className={classes.inputForm} autoComplete="off" onSubmit={onSubmit}>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>Email</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="email"
                            variant="outlined"
                            margin="normal"
                            // defaultValue="test@test.com" 
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>비밀번호</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            // defaultValue="1234qwer" 
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>비밀번호 확인</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="password_confirm"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            // defaultValue="1234qwer" 
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>도장명</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="dojo_name"
                            variant="outlined"
                            margin="normal"
                            // defaultValue="NewDojo" 
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>관리자</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="manager"
                            variant="outlined"
                            margin="normal"
                            // defaultValue="Man1" 
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>연락처</Typography>
                        <TextField 
                            className={classes.inputArea} 
                            id="outlined-basic" 
                            name="phone" 
                            variant="outlined" 
                            margin="normal" 
                            // defaultValue="02-1234-5678"
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>주소</Typography>
                        <TextField 
                            className={classes.inputArea} 
                            id="outlined-basic" 
                            name="address" 
                            variant="outlined" 
                            margin="normal" 
                            // defaultValue="Address Long"
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>설명</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="description" 
                            className={classes.inputArea} 
                            variant="outlined" 
                            multiline 
                            rows="6" 
                            margin="normal" 
                            // defaultValue="descripttttttion"
                            required
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>도장 사진<br/>(최대 5장)</Typography>
                        <div className={classes.inputArea}>
                            <Table className={clsx(classes.table, classes.inputFileArea)} size="small" aria-label="a dense table">
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell>파일명</TableCell>
                                        <TableCell align="right">사이즈</TableCell>
                                    
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {drawTableRow()}
                                    <TableRow style={{ height: 33 * ( 5 - fileList.length) }}>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                </TableBody>
                            </Table>
                            
                            <input type="file" name="images" multiple accept=".png, .jpg, .jpeg" onChange={onFileSelect} />
                        </div>
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}></Typography>
                        <div className={classes.buttonWrapper}>
                            <Button type="submit" variant="contained" color="primary" >가입하기</Button>
                        </div>

                    </div>
                </form>

        
        
                </div>
            </Paper>
    
            </main>
  
        </Fragment>
    )
}

export default withStyles(styles)(LoginForm);