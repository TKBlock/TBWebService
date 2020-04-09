import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import IssueanceModal from '../../components/issueanceModal';


import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Box } from '@material-ui/core';

import MaterialTable from 'material-table';
import { GET_APPROVEED_USER } from './students'

import { useQuery, useMutation } from '@apollo/react-hooks';
import Cookies from 'js-cookie';

import tableIcons from '../../components/tableIcons'
import { gql } from 'apollo-boost';

const GET_ASSOSIATIONS_BY_STATE = gql`
    query assosiationsByState($uuid: ID!, $state: Int) {
      assosiationsByState(web_user_uuid: $uuid, state: $state) {
          web_user_uuid
          assn_name
      }
    }
`;



const CREATE_ISSUANCE = gql`
  mutation createIssuance(
    $assn_uuid: ID!,
    $dojo_uuid: ID!,
    $user_uuid: [ID]!,
    $issue_name: String,
    $message: String,
  ) {
    createIssuance(
      assn_uuid: $assn_uuid,
      dojo_uuid: $dojo_uuid,
      user_uuid: $user_uuid,
      issue_name: $issue_name,
      message: $message,
    ) {
      status, 
      message
    }
  }
`

const ISSUANCE_HISTORY = gql`
  query issuancesForDojo(
    $web_user_uuid: ID
  ) {
    issuancesForDojo(
      web_user_uuid: $web_user_uuid
    ) {
      user_uuid
      user_name
      assn_uuid
      assn_name

      issue_name
      message
      state
      stateText
      request_date
      issue_date
      list_date
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

const tabLabel = ['급/단증 발급', '발급 이력'];


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
  const [selectedRows, setSelectedRows] = React.useState(null);


  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);

  const [tab1Cols, setTab1Cols] = React.useState({
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

  const [tab2Cols, setTab2Cols] = React.useState({
    columns: [
      { 
        title: '이름', 
        field: 'user_name',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      { 
        title: '발급항목명', 
        field: 'issue_name',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      {
        title: '신청 협회', 
        field: 'assn_name',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      {
        title: '상태',
        field: 'stateText',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        }
      },
      {
        title: '신청/발급일자',
        field: 'list_date',
        cellStyle: {
          textAlign: 'center'
        },
        headerStyle: {
          textAlign: 'center',
          paddingLeft: 48,
        },
        render: (rowData) => {
          console.log(rowData);

          return (<span>
            {new Date(rowData.list_date).toLocaleString()}
          </span>)
        }
      },
    ],
  });

  const assnResponse = useQuery(GET_ASSOSIATIONS_BY_STATE, 
    { variables : { 
      uuid : JSON.parse(Cookies.get("signIn")).uuid,
      state: 2
    } }, );

  const aprResponse = useQuery(GET_APPROVEED_USER, 
    { variables : { 
      uuid : JSON.parse(Cookies.get("signIn")).uuid,
    } }, );

  const issueResponse = useQuery(ISSUANCE_HISTORY, 
    { variables : { 
      web_user_uuid : JSON.parse(Cookies.get("signIn")).uuid,
    } }, );
  

  console.log(issueResponse)

    
  const [ createIssuance ] = useMutation(CREATE_ISSUANCE, {
    onCompleted({createIssuance}) {
      // window.location.reload();

      issueResponse.refetch();
      // aprResponse.refetch();
    }
  })

  console.log(assnResponse);

  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRequest = (association, name, message) => {
    console.log(selectedRows);
    let IDs = selectedRows.map(x => x.mobile_user_uuid)

    createIssuance({
      variables: {
        assn_uuid: association,
        dojo_uuid : JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
        state: 2,
        issue_name: name,
        message: message,
      }
    })

  }


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
                    title="급/단증 발급신청"
                    columns={tab1Cols.columns}
                    // onRowClick={handleOpen}
                    isLoading={aprResponse.loading}
                    data={aprResponse.loading ? [] : aprResponse.data.registratedUser}
                    options={{
                      pageSize: 10,
                      selection: true
                    }}
                    actions={[
                      {
                        icon: '요청',
                        iconProps: {
                          className: classes.button
                          
                        },
                        onClick: (evt, data) => {
                          setOpenRequestDialog(true);
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
        <IssueanceModal
          open={openRequestDialog}
          onClose={() => setOpenRequestDialog(false)}
          associations={assnResponse.loading ? [] : assnResponse.data.assosiationsByState }
          onClickCancel={() => setOpenRequestDialog(false)}
          onSubmit={handleRequest}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
                <MaterialTable
                    icons={tableIcons}
                    title="신청/발급이력"
                    columns={tab2Cols.columns}
                    // onRowClick={handleOpen}
                    isLoading={issueResponse.loading}
                    data={issueResponse.loading ? [] : issueResponse.data.issuancesForDojo}
                    options={{
                      pageSize: 10,
                    }}
                />
            </MuiThemeProvider>

          </Paper>
        </main>

      </TabPanel>

    </Fragment>
   );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
