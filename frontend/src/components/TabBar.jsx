import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useRouteMatch, useParams, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CurrentUser } from '../App';
import { useCourse, useCurrentPage } from '../utils';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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
  const currUser = useContext(CurrentUser);
  const currPage = useCurrentPage();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // we want tabs be to highlight based on route
  // how is it highlighted?
  // it's highlighted based on index set in 'value
  // instead for each Tab we specify a custom 'value' in jsx
  // and set the value in Tabs to currently active route
  //
  const tabLabel = label => <Typography variant="h6">{label}</Typography>;

  const getActiveTabIndex = () => {
    switch (currPage) {
      case 'dashboard':
        return 0;
      case 'feed':
        return 1;
      case 'chat':
        return 2;
      case 'admin':
        return 3;
      default:
        return false;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar disabled position="static" classes={{ root: classes.tabs }}>
        <Tabs
          variant="fullWidth"
          value={getActiveTabIndex()}
          onChange={handleChange}
          classes={{ root: classes.tabs, flexContainer: classes.tabs }}
          //   aria-label="nav tabs example"
        >
          <LinkTab
            classes={{ root: classes.tab, wrapper: classes.tab }}
            label={tabLabel('Dashboard')}
            pagePath="dashboard"
          />
          <LinkTab
            className={classes.tab}
            label={tabLabel('Feed')}
            to={`/kudo/${params.course}/feed`}
            pagePath="feed"
          />
          <LinkTab
            className={classes.tab}
            label={tabLabel('Course Chat')}
            pagePath="chat"
          />
          {currUser.admin ? (
            <LinkTab
              className={classes.tab}
              label={tabLabel('Manage Course')}
              pagePath="admin"
            />
          ) : null}
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

function LinkTab({ pagePath, ...props }) {
  const course = useCourse();
  return (
    <Tab
      component={Link}
      disabled={course === 'dashboard'}
      to={`/kudo/${course}/${pagePath}`}
      value={pagePath}
      {...props}
    />
  );
}

export { TabBar };
