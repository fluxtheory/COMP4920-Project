import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Chat } from './Chat';
import { Dashboard } from './Dashboard';
import { CoursePage } from './CoursePage';

const useStyles = makeStyles(theme => ({
  kudoApp: {
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: '1fr 5fr 2fr',
    gridTemplateRows: '1fr 8fr',
    gridTemplateAreas: `"left tabs right"
                        "left middle right"
                        "left middle right"`,
    height: '100vh',
    width: '100%',
    fontSize: '2rem',
  },

  topTabBar: {
    gridArea: 'tabs',
    background: 'red',
  },

  leftPane: {
    gridArea: 'left',
    background: 'blue',
  },

  rightPane: {
    gridArea: 'right',
    background: 'purple',
  },

  contentArea: {
    gridArea: 'middle',
    background: 'papayawhip',
  },
}));

// TODO: we can potentially even get rid of the kudo prefix
const makePath = path => {
  return `/kudo${path}`;
};

const Kudo = () => {
  const classes = useStyles();
  let { path } = useRouteMatch();

  return (
    <div className={classes.kudoApp}>
      <div className={classes.topTabBar}>Tab Bar</div>
      <div className={classes.leftPane}>Courses Pane</div>
      <div className={classes.rightPane}>Chat Pane</div>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <div className={classes.contentArea}>
        <h3>Changing Content</h3>
        <Switch>
          <Route path={makePath('/dashboard')}>
            <Dashboard />
          </Route>
          <Route path={[makePath('/chat/:id'), makePath('/chat')]}>
            <Chat />
          </Route>
          <Route path={makePath('/courses/:course')}>
            <CoursePage />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export { Kudo };
