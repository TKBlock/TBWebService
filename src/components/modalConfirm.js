import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import gql from 'graphql-tag';
import { Typography, Button } from '@material-ui/core';

export const SHOW_MODAL = gql`
    query showModal {
        showModal @client {
            isShow
            message
        }
    }

`



function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      minWidth: 350,
    };
  }
  

const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      maxWidth: 936,
      margin: 'auto',
      backgroundColor: theme.palette.background.paper,
  
      padding: theme.spacing(5, 3, 5),
    },
    inputForm: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    inputContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    message: {
        fontSize: '1rem',
        textAlign: 'center',
        alignSelf: 'center',
  },
  btnArea : {
    textAlign: 'center',
    marginTop: 12
  },
  button: {
    margin: 8
  }
  }));


export default function SimpleModal(props) {
    const classes = useStyles();
    const { open, onClose, message, 
      textOk, textCancel, onClickOk, onClickCancel,
      ...others } = props;

    const [modalStyle] = React.useState(getModalStyle);

    return (
    <Modal
        open={open}
        onClose={onClose}
        {...others}
    >
        <div style={modalStyle} className={classes.paper}>
            <Typography className={classes.message}>{message}</Typography>

            <div className={classes.btnArea}>
              <Button
                variant="contained" 
                className={classes.button} 
                size="small" 
                color="primary"
                onClick={onClickOk}
              >
                {textOk}
              </Button>

              <Button
                variant="contained" 
                className={classes.button} 
                size="small" 
                color="primary"
                onClick={onClickCancel}
              >
                {textCancel}
              </Button>
              </div>
  
          </div>
        </Modal>
    )

}