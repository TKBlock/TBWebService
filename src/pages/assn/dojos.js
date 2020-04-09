import React, { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Box } from '@material-ui/core';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cookies from 'js-cookie';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import DojoModal from '../../components/dojoModal';


export const GET_DOJOS = gql`
    query getDojos($uuid: ID!) {
        requestingDojos(web_user_uuid: $uuid) {
          IDX
          web_user_uuid
          dojo_name
          manager
          address
          phone
          description
          images
          status
        }

        assignedDojos(web_user_uuid: $uuid) {
          IDX
          web_user_uuid
          dojo_name
          manager
          address
          phone
          description
          images
          status
        }
    }
`;


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
  }


});

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };
  
const requestingColumns = [
        { 
          title: '도장 명', 
          field: 'dojo_name',
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
      ]


const assignedColomns = [
        { 
          title: '도장 명', 
          field: 'dojo_name',
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
      ];


const tabLabel = ['소속 도장', '신청 대기'];


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


function Content(props) {
  const { classes } = props;
  const [tabValue, setTabValue] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState(0);
  
  const { data, loading } = useQuery(GET_DOJOS, 
    { variables : { uuid : JSON.parse(Cookies.get("signIn")).uuid } }, );

  if(loading || !(data && data.requestingDojos && data.assignedDojos)) return <Fragment></Fragment>


  console.log(data);

  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#009be5',
        light: '#009be5',
        dark: '#009be5',
      }
    },
  });

  const handleChangeTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpen = (event, rowData) => {
    setSelectedData(rowData);
    setOpen(true);

    console.log(rowData);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <MaterialTable
                icons={tableIcons}
                title="소속 도장"
                columns={assignedColomns}
                data={data.assignedDojos}
                onRowClick={handleOpen}
                options={{
                    pageSize: 10
                }}
            />
          </Paper>
        </main>

      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
            <MaterialTable
                icons={tableIcons}
                title="승인 도장"
                columns={requestingColumns}
                data={data.requestingDojos}
                onRowClick={handleOpen}
                localization={{
                    toolbar: {
                        nRowsSelected: '{0}개 선택'
                    },
                }}
                options={{
                    pageSize: 10,
                    selection: true,
                }}
                />
            </MuiThemeProvider>
          </Paper>

        </main>

      </TabPanel>
      <DojoModal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
            data={selectedData}
            />
    </Fragment>
   );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
