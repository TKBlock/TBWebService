import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import ConfirmModal from '../../components/modalConfirm';

import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Box } from '@material-ui/core';

import tableIcons from '../../components/tableIcons'
import MaterialTable from 'material-table';
import { gql } from 'apollo-boost';

import { useQuery, useMutation } from '@apollo/react-hooks';
import Cookies from 'js-cookie';

const GET_REQUESTED_USER = gql`
  query requestedUser($uuid: ID!) {
    registratedUser(uuid: $uuid, state: 1) {
      mobile_user_uuid
      name
      age
      address
      phone
    }
  }
`;

export const GET_APPROVEED_USER = gql`
  query approvedUser($uuid: ID!) {
    registratedUser(uuid: $uuid, state: 2) {
      mobile_user_uuid
      name
      age
      address
      phone
    }
  }
`;

const UPDATE_REG_STATE = gql`
  mutation updateRegistratedState(
    $dojo_uuid: ID!, $user_uuid: [ID]!, $state: Int
  ) {
    updateRegistratedState(
      dojo_uuid: $dojo_uuid,
      user_uuid: $user_uuid,
      state: $state
    ) {
      status,
      message
    }
  }
`

const DELETE_REG = gql`
  mutation deleteRegistrate(
    $dojo_uuid: ID!, $user_uuid: [ID]!
  ) {
    deleteRegistrate(
      dojo_uuid: $dojo_uuid,
      user_uuid: $user_uuid,
    ) {
      status,
      message
    }
  } 
`

const styles = theme => ({
  paper: {
    maxWidth: '90%',
    minWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    width: '100%',
    margin: 0,
    padding: theme.spacing(6, 4),
    background: '#eaeff1',
  },
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tableHead: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: -28,
    '&:nth-child(2)': {
      width: 200
    },
    '&:nth-child(3)': {
      width: 150
    },
    '&:nth-child(4)': {
    },
    '&:nth-child(5)': {
      width: 300
    },
  },
  tablecell: {
    '&:nth-child(2)': {
      width: 200
    },
    '&:nth-child(3)': {
      width: 150,
      textAlign: 'center',
    },
    '&:nth-child(4)': {
      textAlign: 'left',
    },
    '&:nth-child(5)': {
      width: 300,
      textAlign: 'center',
    },
  },
  sortLabel: {
    marginLeft: -32,
  },
  button: {
    '&:hover': {
      backgroundColor: 'rgb(0, 108, 160)'
    },
    color: '#fff',
    backgroundColor: '#009be5',
    padding: '6px 16px',
    fontSize: '0.875rem',
    minWidth: '64px',
    minHeight: '36px',
    boxSizing: 'border-box',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    lineHeight: 1.75,
    borderRadius: '4px',
    letterSpacing: '0.02857em',
  },
});

const tabLabel = ['수련생 목록', '승인 대기'];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Fragment
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Fragment>
  );
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009be5',
    },
    secondary: {
      main: '#009be5',
    },
  },
  overrides: {
    MuiIconButton: {
      colorInherit: {
        paddingLeft: 8,
        paddingRight: 8,
        '&:hover': {
          backgroundColor: 'transparent',
          
        }
      }
    }
  }
});

function Content(props) {
  const { classes } = props;
  const [tabValue, setTabValue] = React.useState(0);

  const [openApprvDialog, setOpenApprvDialog] = React.useState(false);
  const [openRejectDialog, setOpenRejectDialog] = React.useState(false);

  const [selectedRows, setSelectedRows] = React.useState(null);

  const [state, setState] = React.useState({
    columns: [
      { 
        title: '이름', 
        field: 'name',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      { 
        title: '나이', 
        field: 'age',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      {
        title: '주소', 
        field: 'address',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      {
        title: '연락처',
        field: 'phone',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
    ],
  });



  const [ updateRegistratedState ] = useMutation(UPDATE_REG_STATE, {
    onCompleted({updateRegistratedState}) {
      // window.location.reload();

      setOpenApprvDialog(false);

      regResponse.refetch();
      aprResponse.refetch();
    }
  })
  
  const [ deleteRegistrate ] = useMutation(DELETE_REG, {
    onCompleted({deleteRegistrate}) {
      // window.location.reload();

      setOpenRejectDialog(false);

      regResponse.refetch();
      aprResponse.refetch();

    }
  })
  
  const handleApprove = () => {
    // useMutation()

    let IDs = selectedRows.map(x => x.mobile_user_uuid)

    updateRegistratedState({
      variables: {
        dojo_uuid : JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
        state: 2
      }
    })


    console.log(IDs);
    
  }
   
  const handleReject = () => {
    let IDs = selectedRows.map(x => x.mobile_user_uuid)

    deleteRegistrate({
      variables: {
        dojo_uuid : JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
        state: 2
      }
    })

  }

  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const regResponse = useQuery(GET_REQUESTED_USER, 
    { variables : { 
      uuid : JSON.parse(Cookies.get("signIn")).uuid,
    } }, );

  const aprResponse = useQuery(GET_APPROVEED_USER, 
    { variables : { 
      uuid : JSON.parse(Cookies.get("signIn")).uuid,
    } }, );

  return (
    <Fragment>
        
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Tabs value={tabValue} onChange={handleChangeTabValue} textColor="inherit">
          <Tab textColor="inherit" label={tabLabel[0]} />
          <Tab textColor="inherit" label={tabLabel[1]} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
              <MaterialTable
                  icons={tableIcons}
                  title="수련생 목록"
                  columns={state.columns}
                  // onRowClick={handleOpen}
                  isLoading={aprResponse.loading}
                  data={aprResponse.loading ? [] : aprResponse.data.registratedUser}
                  options={{
                    pageSize: 10,
                    // selection: true
                  }}
              />
            </MuiThemeProvider>

          </Paper>
        </main>

      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
              <MaterialTable
                icons={tableIcons}
                title="등록 요청"
                columns={state.columns}
                // onRowClick={handleOpen}
                isLoading={regResponse.loading}
                data={regResponse.loading ? [] : regResponse.data.registratedUser}
                options={{
                  pageSize: 10,
                  selection: true
                }}
                actions={[
                  {
                    icon: '승인',
                    iconProps: {
                      className: classes.button
                      
                    },
                    onClick: (evt, data) => {
                      setOpenApprvDialog(true);
                    }
                  },
                  {
                    icon: '거부',
                    iconProps: {
                      className: classes.button
                      
                    },
                    onClick: (evt, data) => {
                     setOpenRejectDialog(true);
                    }
                  },
                ]}
                onSelectionChange={(rows) => {
                  setSelectedRows(rows);
                  console.log(rows);
                }}
                />
            </MuiThemeProvider>            
          </Paper>
        </main>
        
        <ConfirmModal
          open={openApprvDialog}
          onClose={() => setOpenApprvDialog(false)}
          message={"선택한 학생들의 등록을 승인하시겠습니까?"}
          textOk={"승인"}
          textCancel={"취소"}
          onClickOk={handleApprove}
          onClickCancel={() => setOpenApprvDialog(false)}

        />

        <ConfirmModal
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
          message={"선택한 학생들의 등록을 거부하시겠습니까?"}
          textOk={"확인"}
          textCancel={"취소"}
          onClickOk={handleReject}
          onClickCancel={() => setOpenRejectDialog(false)}

        />

      </TabPanel>

    </Fragment>
   );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
