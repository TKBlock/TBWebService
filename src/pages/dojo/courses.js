import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Cookies from 'js-cookie';

import Description from '@material-ui/icons/Description';

import CourseModal from '../../components/courseModal';
import CourseDetailModal from '../../components/courseDetailModal';
import CourseConfirmModal from '../../components/modalConfirm';

import MaterialTable from 'material-table';

import tableIcons from '../../components/tableIcons'

import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

export const GET_COURSE = gql`
    query getCourse($dojo_uuid: ID!) {
      courses(dojo_uuid: $dojo_uuid) {
            IDX
            course_name
            manager
            description
            images
        }
    }
`;

export const DELETE_COURSE = gql`
  mutation deleteCourse($idx: ID!) {
    deleteCourse(IDX: $idx) {
      status
      message
    }
  }

`

export const ENROLLMENT_BY_STATE = gql` 
    query enrollmentByState(
      $dojo_uuid: ID!
      $course_idx: ID!
      $state: Int

    ) {
      enrollmentByState(
        dojo_uuid: $dojo_uuid
        course_idx: $course_idx
        state: $state
      )
      {
        mobile_user_uuid
        name
        age
        registered_date
        start_date
        end_date
      }
    }
`

export const UPDATE_ENROLLMENT_STATE = gql`
  mutation updateEnrollmentState(
    $course_idx: ID!,
    $dojo_uuid: ID!,
    $user_uuid: [ID]!,
    $state: Int,
  ) {
    updateEnrollmentState(
      course_idx: $course_idx,
      dojo_uuid: $dojo_uuid,
      user_uuid: $user_uuid,
      state: $state
    ) 
    {
      status
      message
    }
  }

`

export const DELETE_ENROLLMENT = gql`
  mutation deleteEnrollment(
    $course_idx: ID!,
    $dojo_uuid: ID!,
    $user_uuid: [ID]!,
  ) {
    deleteEnrollment(
      course_idx: $course_idx,
      dojo_uuid: $dojo_uuid,
      user_uuid: $user_uuid,
    ) 
    {
      status
      message
    }
  }

`



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}


const styles = theme => ({
  paper: {
    maxWidth: '90%',
    minWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
    padding: theme.spacing(6, 4),
    height: '100%'
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
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
  testFlex1: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column'
    // backgroundColor: 'lightgray',
  },
  testFlex2: {
    flex: 5,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'gray',
  },
  main: {
    display: 'flex',
    flex: '1',
    width: '100%',
    margin: 0,

  },
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  footer: {
    height: 80,
    backgroundColor: 'gray'
  },
  spacing: {
    flex: 1,
  },
  table: {
    
  },
  overflowAuto: {
    overflow: 'auto'
  },
  noToolbar: {
    marginTop: 48
  },
  button: {
    marginRight: 8
  },
  buttonArea: {
    textAlign: 'right',
    flex: 1
  },
  h650: {
    height: 650
  },
  h698: {
    height: 552
  },
  tableRow: {
    '&:hover' : {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
  },
  selectedRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  descriptionButton: {
    cursor: 'pointer'
  }
});


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
    MuiPaper: {
      elevation2: {
        boxShadow: 'none'
      }
    }
  }
});


function Content(props) {
  const { classes } = props;


  const [ showCourseModal, setShowCourseModal ] = React.useState(false);
  const [ showCourseDetailModal, setShowCourseDetailModal ] = React.useState(false);


  const [ showCourseApproveModal, setShowCourseApproveModal ] = React.useState(false);
  const [ showCourseRejectModal, setShowCourseRejectModal ] = React.useState(false);
  const [ showCourseEndModal, setShowCourseEndModal ] = React.useState(false);
  const [ showCourseCancelModal, setShowCourseCancelModal ] = React.useState(false);
  
  const [ showCourseDeleteModal, setShowCourseDeleteModal] = React.useState(false);

  const [selectedData, setSelectedData] = React.useState(0);
  const [selectedRowId, setSelectedRowId] = React.useState(0);

  const [value, setValue] = React.useState(0);

  const [detailData, setDetailData ] = React.useState(0);
  const [currentCourse, setCurrentCourse] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState(null);
  const [selectedEnrolledRows, setSelectedEnrolledRows] = React.useState(null);


  const [enrolledColumn, setEnrolledState] = React.useState({
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
        title: '등록일자', 
        field: 'start_date',
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

  const [registeredState, setRegisteredState] = React.useState({
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
        title: '신청일자', 
        field: 'registered_date',
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

  const { data, loading, error } = useQuery(GET_COURSE, 
    { variables : { dojo_uuid : JSON.parse(Cookies.get("signIn")).uuid } }, );


  const enrolledData = useQuery(ENROLLMENT_BY_STATE);
  

  const [deleteCourse] = useMutation(DELETE_COURSE, {
      onCompleted({deleteCourse}) {
        console.log(deleteCourse);

        window.location.reload();
    }
  })

  const [updateEnrollment] = useMutation(UPDATE_ENROLLMENT_STATE, {
    onCompleted({updateEnrollment}) {
      
      setShowCourseApproveModal(false);
      setShowCourseRejectModal(false);
      setShowCourseCancelModal(false);
      setShowCourseEndModal(false);

      let uuid = JSON.parse(Cookies.get("signIn")).uuid

      let enrollState = 0;

      switch(value) {
        case 0: enrollState = 1; break;
        case 1: enrollState = 0; break;
      }

      enrolledData.refetch({
        dojo_uuid: uuid,
        course_idx: selectedData.IDX,
        state: enrollState
      })
  
  }
  })


  const [deleteEnrollment] = useMutation(DELETE_ENROLLMENT, {
    onCompleted({updateEnrollment}) {
      
      setShowCourseApproveModal(false);
      setShowCourseRejectModal(false);


      let uuid = JSON.parse(Cookies.get("signIn")).uuid

      let enrollState = 0;

      switch(value) {
        case 0: enrollState = 1; break;
        case 1: enrollState = 0; break;
      }

      enrolledData.refetch({
        dojo_uuid: uuid,
        course_idx: selectedData.IDX,
        state: enrollState
      })
  
    }
  })

  const handleChange = (event, newValue) => {
    setValue(newValue);

    
    let uuid = JSON.parse(Cookies.get("signIn")).uuid

    let enrollState = 0;

    switch(newValue) {
      case 0: enrollState = 1; break;
      case 1: enrollState = 0; break;
    }

    enrolledData.refetch({
      dojo_uuid: uuid,
      course_idx: selectedData.IDX,
      state: enrollState
    })

  };
  

  const onClickCourseAdd = () => {
    setShowCourseModal(true);
  }

  const handleCourseModalClose = () => {
    setShowCourseModal(false);
    // window.location.reload();

  };

  const handleCourseDetailModalClose = () => {
    setShowCourseDetailModal(false);
  };

  const handleCourseDeleteModalClose = () => {
    setShowCourseDeleteModal(false);

  };

  const handleApporveEnroll = () => {

    let IDs = selectedRows.map(x => x.mobile_user_uuid);

    console.log(selectedRows);
    updateEnrollment({
      variables: {
        course_idx: selectedData.IDX,
        dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
        state: 1
      }
    })

    // selectedData.IDX//course IDX

  }

  const handleRejectEnroll = () => {
    let IDs = selectedRows.map(x => x.mobile_user_uuid);

    deleteEnrollment({
      variables: {
        course_idx: selectedData.IDX,
        dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
      }
    })

  }


  const handleEndEnroll = () => {
    let IDs = selectedEnrolledRows.map(x => x.mobile_user_uuid);

    console.log(selectedEnrolledRows);
    updateEnrollment({
      variables: {
        course_idx: selectedData.IDX,
        dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
        state: 2
      }
    })
  }

  const handleCancelEnroll = () => {
    let IDs = selectedEnrolledRows.map(x => x.mobile_user_uuid);

    console.log(selectedEnrolledRows);
    updateEnrollment({
      variables: {
        course_idx: selectedData.IDX,
        dojo_uuid: JSON.parse(Cookies.get("signIn")).uuid,
        user_uuid: IDs,
        state: 5
      }
    })
  }

  const handleDeleteCourse = () => {

    console.log(selectedData);

    deleteCourse({
      variables: {
        idx: selectedData.IDX
      }
    });
  }


  const onClickRow = (row) => {

    return () => {

      let uuid = JSON.parse(Cookies.get("signIn")).uuid
      console.log(row);
      setSelectedData(row)

      let enrollState = 0;

      switch(value) {
        case 0: enrollState = 1; break;
        case 1: enrollState = 0; break;
      }

      enrolledData.refetch({
        dojo_uuid: uuid,
        course_idx: row.IDX,
        state: enrollState
      })

    }
  }

  const showDescription = (row) => {
    return () => {
      console.log(row);
      setDetailData(row);
      setShowCourseDetailModal(true);
    }
  }

  const onClickDeleteCourse = () => {
    setShowCourseDeleteModal(true);
  }

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  if(loading) return <Fragment></Fragment>

  return (
    <Fragment>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <main className={classes.main}>
            <div className={classes.contentWrapper}>
              <div className={classes.testFlex1}>
              <Toolbar
                className={classes.toolbar}
              >
                  <Typography className={classes.title} variant="h6" id="tableTitle">
                    {'과정 목록'}

                  </Typography>


              </Toolbar>
              <Toolbar
                className={classes.toolbar}
              >
                  <div className={classes.buttonArea}> 
                    <Button
                      variant="contained" 
                      className={classes.button} 
                      size="small" 
                      color="primary"
                      onClick={onClickCourseAdd}
                    >
                      추가
                    </Button>
                    <Button 
                      variant="contained" 
                      className={classes.button} 
                      size="small" 
                      color="primary"
                      disabled={!selectedData}
                      onClick={onClickDeleteCourse}                    
                    >
                      삭제
                    </Button>

                  </div>
              </Toolbar>
              
              <div 
                className={clsx(classes.overflowAuto, classes.h650)}
              >
                <Table stickyHeader className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">과정명</TableCell>
                      <TableCell align="center">인원</TableCell>
                      <TableCell align="center" style={{width: 120}}>상세보기</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                    data.courses.map(course => (
                      <TableRow 
                        key={course.IDX} 
                        className={clsx(classes.tableRow, selectedData.IDX == course.IDX ? classes.selectedRow : null)} 
                        onClick={onClickRow(course)}
                      >
                        <TableCell component="th" scope="row">
                          {course.course_name}
                        </TableCell>
                        <TableCell align="right">{course.calories}</TableCell>
                        <TableCell 
                          align="center" 
                          style={{width: 120}} 
                          >
                            <Description 
                              onClick={showDescription(course)}
                              className={classes.descriptionButton} 
                            />
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ div>

              </div>
              <div className={classes.testFlex2} >
              <Toolbar
                className={classes.toolbar}
              >
                  <Typography className={classes.title} variant="h6" id="tableTitle">
                    {'수강생 목록'}
                  </Typography>
              </Toolbar>

              <Toolbar
                className={classes.toolbar}
              >
                  <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    value={value}
                    onChange={handleChange}
                  >
                    <Tab label="수강생" {...a11yProps(0)} />
                    <Tab label="승인요청" {...a11yProps(1)}/>
                  </Tabs>
                  {value == 1 && <div 
                    className={classes.buttonArea}
                  > 
                    <Button
                      variant="contained" 
                      className={classes.button} 
                      size="small" 
                      color="primary"
                      onClick={() => {
                        setShowCourseApproveModal(true);
                      }}
                    >
                      승인
                    </Button>
                    <Button 
                      variant="contained" 
                      className={classes.button} 
                      size="small" 
                      color="primary"
                      onClick={() => {
                        setShowCourseRejectModal(true);
                      }}
                    >
                      거절
                    </Button>
                  </div>}
                  {value == 0 && <div 
                    className={classes.buttonArea}
                  > 
                    <Button
                      variant="contained" 
                      className={classes.button} 
                      size="small" 
                      color="primary"
                      onClick={() => {
                        setShowCourseEndModal(true);
                      }}
                    >
                      수료
                    </Button>
                    <Button 
                      variant="contained" 
                      className={classes.button} 
                      size="small" 
                      color="primary"      
                      onClick={() => {
                        setShowCourseCancelModal(true);
                      }}
      
                    >
                      수강취소
                    </Button>
                  </div>}
              </Toolbar>
              <MuiThemeProvider theme={theme}>
              <TabPanel value={value} index={0}>
                <div 
                  className={clsx(classes.overflowAuto, classes.h650)}
                >
                  <MaterialTable
                      icons={tableIcons}
                      title="수강생"
                      columns={enrolledColumn.columns}
                      // onRowClick={handleOpen}
                      isLoading={enrolledData.loading}
                      data={enrolledData.data ? enrolledData.data.enrollmentByState : []}
                      options={{
                        pageSize: 10,
                        selection: true,
                        showTitle: false,
                        toolbar: false,
                        paging: false,
                      }}
                      onSelectionChange={(rows) => {
                        setSelectedEnrolledRows(rows);
                        console.log(rows);
                      }}
                  />
                </div>
                <div className={classes.spacing} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div 
                  className={clsx(classes.overflowAuto, classes.h650)}
                >
                  <MaterialTable
                      icons={tableIcons}
                      title="수강생"
                      columns={registeredState.columns}
                      // onRowClick={handleOpen}
                      isLoading={enrolledData.loading}
                      data={enrolledData.data ? enrolledData.data.enrollmentByState : []}

                      options={{
                        pageSize: 10,
                        selection: true,
                        showTitle: false,
                        toolbar: false,
                        paging: false,
                      }}
                      onSelectionChange={(rows) => {
                        setSelectedRows(rows);
                        console.log(rows);
                      }}
                  />
                    

                </div>
                <div className={classes.spacing} />
              </TabPanel>
              </MuiThemeProvider>

              </div>
            </div>
            <CourseModal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={showCourseModal}
              onClose={handleCourseModalClose}
            />
            <CourseDetailModal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={showCourseDetailModal}
              onClose={handleCourseDetailModalClose}
              data={detailData}
            />
            <CourseConfirmModal
              textOk="확인"
              textCancel="취소"
              message="정말 삭제하시겠습니까?"
              open={showCourseDeleteModal}
              onClose={handleCourseDeleteModalClose}
              onClickOk={handleDeleteCourse}
              onClickCancel={handleCourseDeleteModalClose}
            />
            <CourseConfirmModal
              textOk="확인"
              textCancel="취소"
              message="정말 승인하시겠습니까?"
              open={showCourseApproveModal}
              onClose={() => {
                setShowCourseApproveModal(false);
              }}
              onClickOk={handleApporveEnroll}
              onClickCancel={() => {
                setShowCourseApproveModal(false);
              }}
            />
            <CourseConfirmModal
              textOk="확인"
              textCancel="취소"
              message="정말 거절하시겠습니까?"
              open={showCourseRejectModal}
              onClose={() => {
                setShowCourseRejectModal(false);
              }}
              onClickOk={handleRejectEnroll}
              onClickCancel={() => {
                setShowCourseRejectModal(false);
              }}
            />
            <CourseConfirmModal
              textOk="확인"
              textCancel="취소"
              message="해당 인원들을 수료처리 하시겠습니까?"
              open={showCourseEndModal}
              onClose={() => {
                setShowCourseEndModal(false);
              }}
              onClickOk={handleEndEnroll}
              onClickCancel={() => {
                setShowCourseEndModal(false);
              }}
            />
            <CourseConfirmModal
              textOk="확인"
              textCancel="취소"
              message="해당인원들의 수강을 취소시키겠습니까?"
              open={showCourseCancelModal}
              onClose={() => {
                setShowCourseCancelModal(false);
              }}
              onClickOk={handleCancelEnroll}
              onClickCancel={() => {
                setShowCourseCancelModal(false);
              }}
            />
            </main>
        </Paper>
      </div>

      

    </Fragment>
   );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
