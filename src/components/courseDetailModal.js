import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { GridList, GridListTile } from '@material-ui/core';
import { config } from '../config';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import ModalMessage from '../components/modalMessage'

import clsx from 'clsx';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export const UPDATE_COURSE = gql`
    mutation updateCourse(
        $IDX: ID!,
        $course_name: String,
        $manager: String!,
        $images: [Upload],
        $description: String
    ) {
        updateCourse(
            IDX: $IDX,
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
  inputArea: {
    flexBasis: '60%',
    textAlign: 'left'
  },
  textMultline: {
    flexBasis: '60%',
    textAlign: 'left',
    minHeight: 150,
    borderRadius: 8,
    border: '1px solid threedface',
  },
  imgArea: {
    flexBasis: '60%',
    textAlign: 'left',
    border: '1px solid threedface'
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



    const { open, onClose, data, ...others } = props;

    console.log(data);

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [ fileList, setFileList ] = React.useState([]);
    const [ isFileChanged, setIsFileChanged] = React.useState(false);

    const [updateCourse] = useMutation(UPDATE_COURSE, {
        onCompleted({updateDojoAssnStatus}) {

            window.location.reload();
        }
    })

    const drawTableRow = () => {
        let selectedList = [];
      
        for(let i = 0; i < 5; i++) {
            if(fileList[i]) {
                selectedList.push( fileList[i] );
            } else {
                break;
            }
        }

        return selectedList.map(row => (
            <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                {row.name}
                </TableCell>
                <TableCell align="right">{row.size}</TableCell>
            </TableRow>
        ))
    }

    const handleClose = () => {
        setModalOpen(false);
        onClose();
    };


    const onSubmit = (event) => {

        event.preventDefault();

        updateCourse({
            variables: {
                IDX: data.IDX,
                course_name: event.target.course_name.value,
                manager: event.target.manager.value,
                images: fileList,
                description: event.target.description.value,
            }
        })
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
                    <Typography className={classes.inputLabel}>과정 이름</Typography>
                    <TextField 
                        id="outlined-basic"
                        name="course_name" 
                        variant="outlined" 
                        margin="normal" 
                        defaultValue={data && data.course_name} 
                    />
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>관리자</Typography>
                    <TextField 
                        id="outlined-basic"
                        name="manager" 
                        variant="outlined" 
                        margin="normal" 
                        defaultValue={data && data.manager} 
                    />
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>설명</Typography>
                    <TextField 
                        id="outlined-basic" 
                        name="description" 
                        className={classes.inputArea}
                        variant="outlined" 
                        multiline rows="6" 
                        margin="normal" 
                        defaultValue={data && data.description} 
                        />
                </div>
                <div className={classes.inputContainer}>
                    <Typography className={classes.inputLabel}>도장 사진<br/>(최대 5장)</Typography>
                    <div className={classes.inputArea}>
                    {
                        !isFileChanged && (
                        <div className={classes.imgArea}>
                        <GridList className={classes.gridList} cellHeight={205}>
                            {data && data.images.map( (img, index) => (
                            <GridListTile key={index + img}>
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
                        )
                    }
                    {
                        isFileChanged && (
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
                        )
                    }
                    <input type="file" name="images" style={ {marginTop: 10} } multiple accept=".png, .jpg, .jpeg"  onChange={onFileSelect} />
                    </div>
                    
                </div>

            
                <div className={classes.inputContainer} style={{textAlign: 'right'}}>
                    <div className={classes.inputLabel}></div>
                    <div style={{  flexBasis: '60%' }}>
                        <Button variant="contained" color="primary" type="submit" >수정</Button>
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