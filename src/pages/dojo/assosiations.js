import React, { Fragment  } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Cookies from 'js-cookie';

import AssnModal from '../../components/assnModal';
import tableIcons from '../../components/tableIcons'

export const GET_ASSOSIATIONS = gql`
    query getAssosications($uuid: ID!) {
      assosiations(web_user_uuid: $uuid) {
          IDX
          web_user_uuid
          assn_name
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
    '&:nth-child(1)': {
      width: 250
    },
    '&:nth-child(3)': {
      width: 150
    },
    '&:nth-child(2)': {
    },
    '&:nth-child(4)': {
      width: 300
    },
  },
  tablecell: {
    '&:nth-child(1)': {
      width: 250,
      textAlign: 'center',
    },
    '&:nth-child(3)': {
      width: 150,
      textAlign: 'center',
    },
    '&:nth-child(2)': {
      textAlign: 'left',
    },
    '&:nth-child(4)': {
      width: 300,
      textAlign: 'center',
    },
  },
  sortLabel: {
    marginLeft: -32,
  },

});


function Content(props) {
  const { classes } = props;

  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState(0);
  const [state, setState] = React.useState({
    columns: [
      { 
        title: '협회 명', 
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
        title: '전화번호', 
        field: 'phone',
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
        field: 'status',
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


  const handleOpen = (event, rowData) => {
    setSelectedData(rowData);
    setOpen(true);

    console.log(rowData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data, loading } = useQuery(GET_ASSOSIATIONS, 
    { variables : { uuid : JSON.parse(Cookies.get("signIn")).uuid } }, );

  if(loading || !(data && data.assosiations)) return <Fragment></Fragment>

  const rows = data && data.assosiations;


  return (
    <Fragment>
      <main className={classes.root}>
        <Paper className={classes.paper}>
            <MaterialTable
              icons={tableIcons}
              title="협회 검색"
              columns={state.columns}
              onRowClick={handleOpen}
              data={rows}
              options={{
                pageSize: 10
              }}
            />
        </Paper>
        <AssnModal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
          data={selectedData}
        />
      </main>
    </Fragment>

  );
}


export default withStyles(styles)(Content);

