import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TextField, Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import ModalMessage from '../../components/modalMessage'

import Cookies from 'js-cookie';


export const UPDATE_WEB_USER_PASSWORD = gql`
    mutation updateWebUserPassword(
      $uuid: ID!
      $prev_password: String!
      $password: String!
    ) {
        updateWebUserPassword(
          uuid: $uuid,
          prev_password: $prev_password,
          password: $password
        ) {
          status
          message
        }
    }


`;

const styles = theme => ({
  paper: {
    maxWidth: '90%',
    minWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
    height: 600,
    display: 'flex'
  },
  block: {
    display: 'block',
  },
  contentWrapper: {
    margin: '40px 16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
    flexBasis: '50%',
  },
  inputLabel: {
      flexBasis: '50%',
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
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  buttonWrapper: {
    display: 'flex',
    flex: 1,
    margin: '20px 0',
    paddingRight: '20%',
    justifyContent: 'flex-end'
  },
  okButton: {
      flexBasis: '10%'
  },
  readonly: {
      marginBottom: 8,
      marginTop: 16,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '20%'
  },
  tabPanel: {
    display: 'flex',
    flex: 1
  },
  tab: {
    fontSize: 16
  },
  buttonArea: {
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'right',
    width: '100%'
  },
  form: {
    minWidth: 480
  }
});


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  

function Content(props) {
  const { classes } = props;

  const [value, setValue] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const [updateWebUserPassword] = useMutation(UPDATE_WEB_USER_PASSWORD, {
    onCompleted({updateWebUserPassword}) {
      // window.location.reload();

      console.log(updateWebUserPassword);

      if(updateWebUserPassword.status == 400) {
        setMessage("비밀번호를 확인해 주세요");
        setModalOpen(true)

        return
      }
      else if(updateWebUserPassword.status == 200) {
        setMessage("비밀번호 변경이 완료되었습니다");
        setModalOpen(true)

        return
      }
      else {
        setMessage("오류가 발생했습니다. 잠시 후 다시 시도해주세요");
        setModalOpen(true)

        return
      }

    }
  });


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
      setModalOpen(false);
      document.location.reload(true);
  };

  const onSubmitPasswordChange = (event) => {

    event.preventDefault();

    console.log("onSubmitPasswordChange");
    if(event.target.password.value !== event.target.password_confirm.value) {
      setMessage("비밀번호가 일치하지 않습니다");
      setModalOpen(true)

      return;
    }


    updateWebUserPassword({
      variables: {
        uuid: JSON.parse(Cookies.get("signIn")).uuid,
        prev_password: event.target.prev_password.value,
        password: event.target.password.value
      }
    })


  }

  return (
    <Fragment>
      <main className={classes.main}>
        <Paper className={classes.paper}>
            <div className={classes.contentWrapper}>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab 
                      label="비밀번호 번경" 
                      className={classes.tab}
                      {...a11yProps(0)} 
                    />
                </Tabs>
                <TabPanel value={value} className={classes.tabPanel} index={0}>
                  <form className={classes.form} onSubmit={onSubmitPasswordChange}>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>기존 비밀번호</Typography>
                        <TextField 
                            id="outlined-basic" 
                            name="prev_password"
                            variant="outlined" 
                            margin="normal" 
                            size="small"
                            type="password"
                            />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>새 비밀번호</Typography>
                        <TextField 
                          id="outlined-basic" 
                          name="password"
                          variant="outlined" 
                          margin="normal" 
                          size="small" 
                          type="password" 
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>새 비밀번호 확인</Typography>
                        <TextField 
                          id="outlined-basic" 
                          name="password_confirm"
                          variant="outlined" 
                          margin="normal" 
                          size="small" 
                          type="password" 
                        />
                    </div>
                    <div className={classes.buttonArea}>
                      <Button type="submit" className={classes.okButton} variant="contained" color="primary"  >저장</Button>
                    </div>
                  </form>

                </TabPanel>
                </div>
            </div>
        </Paper>

        </main>

        <ModalMessage
            open={modalOpen}
            onClose={handleClose}
            message={message}
        />

    </Fragment>
   );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
