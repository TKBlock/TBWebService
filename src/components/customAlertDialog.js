import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function CustomAlertDialog(props) {
    // const classes = useStyles();

    const { open, handleClose, handleOk,
        text } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {text}
            </DialogTitle>
            <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
                {text}
            </DialogContentText> */}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleOk} color="primary">
               확인
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
               취소
            </Button>
            </DialogActions>
        </Dialog>
    )
}