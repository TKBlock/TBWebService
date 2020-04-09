import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Cookies from 'js-cookie';

import ModalMessage from '../components/modalMessage'


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';


export const CREATE_COURSE = gql`
    mutation createCourse(
        $dojo_uuid: ID!,
        $course_name: String!,
        $manager: String!,
        $images: [Upload],
        $description: String
    ) {
        createCourse(
            dojo_uuid: $dojo_uuid,
            course_name: $course_name,
            manager: $manager,
            images: $images,
            description: $description
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
    border: '1px solid threedface'
  },
  inputArea: {
    flexBasis: '60%',
    textAlign: 'left'
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  inputFileArea: {
    borderRadius: 8,
    border: '1px solid threedface'
  },
}));


export default function SimpleModal(props) {
    const classes = useStyles();

    const { open, onClose, data, callback, ...others } = props;

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');


    const [ fileList, setFileList ] = React.useState([]);
    const [ isFileChanged, setIsFileChanged] = React.useState(false);
 
    const [createCourse] = useMutation(CREATE_COURSE, {
        onCompleted({createCourse}) {
            
            if(callback)
                callback();
            
            onClose();
            window.location.reload();
        }
    })

    
    const handleClose = () => {
        setModalOpen(false);
        // onClose();
    };

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
            setIsFileChanged(true);
  
            // multipleUploadMutation({ variables: { files } })
            
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        console.log("Submit")
        console.log(event.target);
        console.log(event.target.course_name.value);
        console.log(event.target.manager.value);
        console.log(event.target.address.value);
        console.log(event.target.description.value);
        console.log(event.target.images);

        let args = {
            dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid,
            course_name: event.target.course_name.value,
            manager: event.target.manager.value,
            address: event.target.address.value,
            images: fileList,
            description: event.target.description.value,
        }

        createCourse({ variables: args })

    }

    return (
    <div>
        <Modal
            open={open}
            onClose={onClose}
            {...others}
        >
        <div style={modalStyle} className={classes.paper}>
            <form className={classes.inputForm} onSubmit={onSubmit}>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>과정명</Typography>
                    <TextField 
                        id="outlined-basic" 
                        name="course_name"
                        variant="outlined" 
                        margin="normal" 
                        // defaultValue="테스트 과정명" 
                    />
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>관리자</Typography>
                    <TextField 
                        id="outlined-basic" 
                        name="manager"
                        variant="outlined" 
                        margin="normal" 
                        // defaultValue="테스트 관리자" 
                    />
                </div>

                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>설명</Typography>
                    <TextField 
                        id="outlined-basic" 
                        name="description" 
                        className={classes.inputArea} 
                        variant="outlined" multiline 
                        rows="6" 
                        margin="normal" 
                        // defaultValue="테스트 설명" 
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
                <div className={classes.inputContainer} style={{textAlign: 'right'}}>
                    <div className={classes.inputLabel}></div>
                    <div style={{  }}>
                        <Button variant="contained" type="submit" color="primary">저장</Button>
                    </div>
                </div>
            </form>
            
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