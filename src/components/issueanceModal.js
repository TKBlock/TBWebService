import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import gql from 'graphql-tag';


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
  inputLabel: {
    flexBasis: '20%',
    flexShrink: 0,
    textAlign: 'right',
    paddingRight: '2rem',
      alignSelf: 'center',
},
  inputArea: {
    flexBasis: '70%',
    textAlign: 'left',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  button: {
    margin: '0 6px'
  }
}));


export default function SimpleModal(props) {
    const classes = useStyles();
    const [association, setAssociation] = React.useState("");
    const { open, onClose, associations, onSubmit, onClickCancel, ...others } = props;

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    const handleChange = event => {
        setAssociation(event.target.value);
      };

    const handleSubmit = (event) => {
        event.preventDefault();

        let assn_uuid = event.target.association.value;
        let issue_name = event.target.issue_name.value;
        let message = event.target.message.value;

        if(onSubmit) {
            onSubmit(assn_uuid, issue_name, message);
        }

        onClose();
    }

    console.log(associations)

    return (
    <div>
        <Modal
            open={open}
            onClose={onClose}
            {...others}
        >
            <div style={modalStyle} className={classes.paper}>
                <form className={classes.inputForm} onSubmit={handleSubmit}>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>요청 협회</Typography>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Select
                                labelId="association-label"
                                id="association"
                                name="association"
                                value={association}
                                onChange={handleChange}
                                labelWidth={0}
                            >
                                <MenuItem key="" value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                  associations.map(x => (
                                    <MenuItem key={x.web_user_uuid} value={x.web_user_uuid}>
                                      <em>{x.assn_name}</em>
                                    </MenuItem>
                                  ))
                                }                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>발급 요청 항목</Typography>
                        <TextField 
                            className={classes.inputArea}
                            id="issue_name" 
                            name="issue_name"
                            variant="outlined" 
                            margin="normal" 
                        />
                    </div>
                    <div className={classes.inputContainer}>
                        <Typography className={classes.inputLabel}>첨부 내용</Typography>
                        <TextField 
                            className={classes.inputArea}
                            id="message" 
                            name="message"
                            variant="outlined" 
                            margin="normal" 
                            multiline
                            rows="4"
                        />
                    </div>
                    <div className={classes.inputContainer} style={{textAlign: 'right'}}>
                    <div className={classes.inputLabel}></div>
                    <div style={{  flexBasis: '70%' }}>
                        <Button className={classes.button} variant="contained" type="submit" color="primary">요청</Button>
                        <Button className={classes.button} variant="contained" color="primary" onClick={onClickCancel}>취소</Button>
                    </div>
                </div>
                </form>
            </div>
        </Modal>
    </div>
    );
}