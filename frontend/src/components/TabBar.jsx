import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useRouteMatch, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
  },
  tabs: {
    height: '100%',
  },
  tab: {
    height: '100%',
  },
}));

function TabBar() {
  const classes = useStyles();
  const location = useLocation();
  const { params } = useRouteMatch('/kudo/:course');
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabel = label => <Typography variant="h6">{label}</Typography>;

  return (
    <div className={classes.root}>
      <AppBar position="static" classes={{ root: classes.tabs }}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          classes={{ root: classes.tabs, flexContainer: classes.tabs }}
          //   aria-label="nav tabs example"
        >
          <LinkTab
            classes={{ root: classes.tab, wrapper: classes.tab }}
            label={tabLabel('Dashboard')}
            to={`/kudo/${params.course}`}
          />
          <LinkTab
            className={classes.tab}
            label={tabLabel('Feed')}
            to={`/kudo/${params.course}/feed`}
          />
          <LinkTab
            className={classes.tab}
            label={tabLabel('Course Chat')}
            to={`/kudo/${params.course}/chat`}
          />
        </Tabs>
      </AppBar>
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      //   onClick={event => {
      //     event.preventDefault();
      //   }}
      {...props}
    />
  );
}

export { TabBar };
