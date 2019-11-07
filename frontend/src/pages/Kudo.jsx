import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Chat } from './Chat';
import { Dashboard } from './Dashboard';
import { CoursePage } from './CoursePage';
import { AuthProtection } from '../components/AuthProtection';
import { CourseBox } from '../components/course/CourseBox';
import { CoursesPane } from '../components/course/CoursesPane';
import { Box } from '@material-ui/core';

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
    display: 'flex',
    flexDirection: 'column',
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

  return (
    <div className={classes.kudoApp}>
      <div className={classes.topTabBar}>Tab Bar</div>
      <div className={classes.leftPane}>
        <CoursesPane />
      </div>
      <div className={classes.rightPane}>Chat Pane</div>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <div className={classes.contentArea}>
        <h3>Changing Content</h3>
        <Switch exact>
          <Route path={makePath('/dashboard')}>
            {/* TODO: this is be be deprecated */}
            <Dashboard />
          </Route>
          <Route path={[makePath('/chat/:id'), makePath('/chat')]}>
            <Chat />
          </Route>
          <Route exact path={makePath('/:course')}>
            <h1>I'm the course dashboard</h1>
            <CoursePage />
          </Route>
          <Route exact path={makePath('/:course/chat')}>
            <h1>I'm the course chat</h1>
          </Route>
          <Route exact path={makePath('/:course/feed')}>
            <h1>I'm the course feed</h1>
          </Route>
          <Route exact path={makePath('/:course/group')}>
            <h1>I'm the course group chat</h1>
          </Route>
          <Route exact path={makePath('/:course/group/settings')}>
            <h1>I'm the course group chat management</h1>
          </Route>
          <Route exact path={makePath('/:course/dm')}>
            <h1>I'm the the private chat</h1>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export { Kudo };
