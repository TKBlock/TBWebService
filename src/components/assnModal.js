import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { GridList, GridListTile } from '@material-ui/core';
import { config } from '../config';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Cookies from 'js-cookie';

import ModalMessage from '../components/modalMessage'



export const JOIN_ASSOSIATION = gql`
    mutation joinAssosiation(
        $assn_uuid: ID!,
        $dojo_uuid: ID!
    ) {
        joinAssosiation(
            assn_uuid: $assn_uuid,
            dojo_uuid: $dojo_uuid
        ) {
            status
            message
        }
    }
`

export const UPDATE_DOJO_ASSN_STATUS = gql`
    mutation updateDojoAssnStatus(
        $assn_uuid: ID!,
        $dojo_uuid: ID!,
        $status: Int
    ) {
        updateDojoAssnStatus(
            assn_uuid: $assn_uuid,
            dojo_uuid: $dojo_uuid,
            status: $status
        ) {
            status
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
      width: '80%'
    };
  }
  

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    maxWidth: 936,
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,

    padding: theme.spacing(5, 3, 10),
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
  inputLabel: {
    flexBasis: '20%',
    flexShrink: 0,
    textAlign: 'right',
    paddingRight: '2rem',
      alignSelf: 'center',
},
imgArea: {
    flexBasis: '60%',
    textAlign: 'left',

    minHeight: 200,
  },
inputArea: {
    flexBasis: '60%',
    textAlign: 'left',
    minHeight: 150,
    borderRadius: 8,
    border: '1px solid threedface',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
}));

export default function SimpleModal(props) {
    const classes = useStyles();

    const { open, onClose, data, ...others } = props;

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');


    const [joinAssosiation] = useMutation(JOIN_ASSOSIATION, {
        onCompleted({joinAssosiation}) {
            console.log(joinAssosiation);

            // console.log(onClose);
            setMessage("신청되었습니다")
            handleOpen();
            // onClose();
        }
    })

    const [updateDojoAssnStatus] = useMutation(UPDATE_DOJO_ASSN_STATUS, {
        onCompleted({updateDojoAssnStatus}) {
            console.log(updateDojoAssnStatus);

            // console.log(onClose);
            setMessage("신청을 취소하였습니다")
            handleOpen();
            // onClose();
        }
    })


    const handleOpen = () => {
        setModalOpen(true);
      };
    
    const handleClose = () => {
        setModalOpen(false);
        onClose();
        document.location.reload(true);
    };

    const onClickAssign = () => {
        joinAssosiation({
            variables: {
                assn_uuid: data.web_user_uuid ,
                dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid
            }
        })
    }

    const onClickCancel = () => {
        updateDojoAssnStatus({
            variables: {
                assn_uuid: data.web_user_uuid ,
                dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid,
                status: 0
            }
        })
    }

    function RenderButton() {
        switch(data.status) {
            
            default:
                return <Button variant="contained" color="primary" onClick={onClickAssign} >신청</Button>;
            case "신청 중" :
                return <Button variant="contained" color="primary" onClick={onClickCancel} >신청 취소</Button>
        }
    }

    return (
    <div>
        <Modal
            open={open}
            onClose={onClose}
            {...others}
        >
        <div style={modalStyle} className={classes.paper}>
            <div className={classes.inputForm}>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>협회명</Typography>
                    <Typography>{data && data.assn_name}</Typography>
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>관리자</Typography>
                    <Typography>{data && data.manager} </Typography>
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>전화번호</Typography>
                    <Typography>{data && data.phone} </Typography>
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>주소</Typography>
                    <Typography>{data && data.address}</Typography>
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>설명</Typography>
                    <Typography className={classes.inputArea}  >{data && data.description}</Typography>
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>협회 사진</Typography>
                    <div className={classes.inputArea}>
                    <div className={classes.imgArea}>
                        <GridList className={classes.gridList} cellHeight={205}>
                        {data.images && data.images.map(img => (
                            <GridListTile key={img}>
                            <img 
                                src={`${config.FILE_SERVER_IP}/${img}`} 
                                alt={img.substr(24, img.length)} 
                                title={img.substr(24, img.length)} 
                                height={205}
                                />
                            </GridListTile>
                        ))}
                        </GridList>
                    </div>
                    </div>
                    
                </div>
            
                <div className={classes.inputContainer} style={{textAlign: 'right'}}>
                    <div className={classes.inputLabel}></div>
                    <div style={{  flexBasis: '60%' }}>
                        <RenderButton />
                       
                    </div>
                </div>
            </div>

        

            <ModalMessage
                open={modalOpen}
                onClose={handleClose}
                message={message}
            />
        </div>
        </Modal>
    </div>
    );
}