import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PublicIcon from '@material-ui/icons/Public';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';


import { useApolloClient } from '@apollo/react-hooks'
import Cookies from 'js-cookie';

import { Link, navigate } from "@reach/router";

import logoWhite from '../assets/images/tkb-logo-white@3x.png';


const categories = [
  {
    id: '운영',
    children: [

      { id: '도장 조회/승인', icon: <DnsRoundedIcon />, url: '/dojos' },
      { id: '급/단증 승인', icon: <SettingsIcon />, url: '/auth_cert' },
    ],
  },
  {
    id: '관리',
    children: [
      { id: '협회 정보', icon: <PublicIcon /> , url: '/' },
      { id: '계정 관리', icon: <PhonelinkSetupIcon />, url: '/settings' },
    ],
  },
];

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },

  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },

  link: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: "8px 16px",
  },
  item: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    
  },
  listitem: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',

    padding: 0
  },
  logoutItem: {
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    cursor: 'pointer'
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, ...other } = props;
  const client = useApolloClient();


  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)} style={{justifyContent: "center"}}>
          <img src={logoWhite} alt="태권블록" height="40px"/>
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            협회
          </ListItemText>
        </ListItem>
      {categories.map(({ id, children }) => (
      <React.Fragment key={id}>
        <ListItem className={classes.categoryHeader}>
          <ListItemText
          classes={{
            primary: classes.categoryHeaderPrimary,
          }}
          >
            {id}
          </ListItemText>
        </ListItem>
        {children.map(({ id: childId, icon, active, url }) => (

          <ListItem
          key={childId}
          button
          className={clsx(classes.listitem)}
          >
            <Link 
              to={url}
              getProps={({ isCurrent }) => {
              // the object returned here is passed to the
              // anchor element's props
                return {
                  className : clsx( classes.link, classes.item, isCurrent && classes.itemActiveItem)
                };
              }}
            >
              <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
              <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
              >
                {childId}
              </ListItemText>
            </Link>
          </ListItem>
        ))}

        <Divider className={classes.divider} />
      </React.Fragment>
      ))}
        <ListItem 
          className={clsx( classes.logoutItem, classes.item)}
          onClick={() => {
            client.writeData({ data: { isLoggedIn: false } })
            Cookies.remove('signIn');
            navigate('/');
          }}
        >
          <ListItemIcon className={classes.itemIcon}><SettingsIcon /></ListItemIcon>
            <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
            >
              {"로그아웃"}
            </ListItemText>

        </ListItem>
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
