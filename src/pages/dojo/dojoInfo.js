import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Cookies from 'js-cookie';
import { config } from '../../config';
import { GridList, GridListTile } from '@material-ui/core';
import clsx from 'clsx';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


export const GET_DOJO = gql`
    query getDojo($uuid: ID!) {
        dojo(web_user_uuid: $uuid) {
            web_user_uuid
            dojo_name
            manager
            address
            phone
            description
            images
        }
    }
`;

export const UPDATE_DOJO_INFO = gql`
    mutation updateDojoInfo(
        $uuid: ID!
        $dojo_name: String!,
        $manager: String!,
        $address: String!,
        $images: [Upload],
        $phone: String,
        $description: String
    ) {
        updateDojoInfo(
            web_user_uuid: $uuid
            dojo_name: $dojo_name,
            manager: $manager,
            address: $address,
            images: $images,
            phone: $phone,
            description: $description
        ) {
            status
            message
        }
    }

`

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  block: {
    display: 'block',
  },
  contentWrapper: {
    margin: '40px 16px',
    display: 'flex',
    flexDirection: 'column'
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
});


function Content(props) {
  const { classes } = props;

  const [ fileList, setFileList ] = React.useState([]);
  const [ isFileChanged, setIsFileChanged] = React.useState(false);

  const { data, loading } = useQuery(GET_DOJO, 
    { variables : { uuid : JSON.parse(Cookies.get("signIn")).uuid } }, );

  const[ updateDojoInfo ] = useMutation(UPDATE_DOJO_INFO, {
    onCompleted({updateDojoInfo}) {
      window.location.reload();

      // console.log(updateDojoInfo);
    }
  })


  if(loading) return <Fragment></Fragment>

  console.log( JSON.parse(Cookies.get("signIn")).uuid)


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

      updateDojoInfo({
        variables: {
          uuid: JSON.parse(Cookies.get("signIn")).uuid,
          dojo_name: event.target.dojo_name.value,
          manager: event.target.manager.value,
          address: event.target.address.value,
          images: fileList,
          phone: event.target.phone.value,
          description: event.target.description.value,
        }
      })
  }


  return (
    <Fragment>
      <main className={classes.main}>
      <Paper className={classes.paper}>
      <div className={classes.contentWrapper}>

        <form className={classes.inputForm} onSubmit={onSubmit}>
            <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>도장명</Typography>
                <TextField 
                  id="outlined-basic" 
                  name="dojo_name"
                  variant="outlined" 
                  margin="normal" 
                  defaultValue={data && data.dojo.dojo_name} />
            </div>
            <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>소속 협회</Typography>
                <Typography className={classes.readonly} margin="normal">협회명 텍스트</Typography>
            </div>
            <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>관리자</Typography>
                <TextField 
                  id="outlined-basic" 
                  name="manager"
                  variant="outlined" 
                  margin="normal" 
                  defaultValue={data && data.dojo.manager} 
                />
            </div>
            <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>연락처</Typography>
                <TextField 
                  id="outlined-basic" 
                  name="phone" 
                  className={classes.inputArea} 
                  variant="outlined" 
                  margin="normal" 
                  defaultValue={data && data.dojo.phone} />
            </div>
            <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>주소</Typography>
                <TextField 
                  id="outlined-basic" 
                  name="address" 
                  className={classes.inputArea} 
                  variant="outlined" 
                  margin="normal" 
                  defaultValue={data && data.dojo.address} 
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
                  defaultValue={data && data.dojo.description} 
                />
            </div>
            <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>도장 사진<br/>(최대 5장)</Typography>
                <div className={classes.inputArea}>
                  {
                    !isFileChanged && (
                      <div className={classes.imgArea}>
                      <GridList className={classes.gridList} cellHeight={205}>
                        {data && data.dojo.images.map( (img, index) => (
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

            <div className={classes.buttonWrapper}>
              <Button type="submit" className={classes.okButton} variant="contained" color="primary">저장</Button>
          </div>
        </form>



      </div>
    </Paper>

        </main>

    </Fragment>
   );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
