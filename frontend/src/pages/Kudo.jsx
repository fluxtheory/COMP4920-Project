import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Chat } from './Chat';
import { Dashboard } from './Dashboard';
import { CoursePage } from './CoursePage';
import { CoursesPane } from '../components/course/CoursesPane';
import { TabBar } from '../components/TabBar';
import { PublicChat } from '../components/PublicChat';
import { Box } from '@material-ui/core';
import { UserSearchForm } from '../components/course/UserSearchForm';

const useStyles = makeStyles(theme => ({
  kudoApp: {
    display: 'grid',
    // gridGap: '1rem',
    gridTemplateColumns: '1.5fr 8fr 1.5fr',
    gridTemplateRows: '1fr 15fr',
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
    background: theme.palette.background.level2,
  },

  contentArea: {
    gridArea: 'middle',
    background: theme.palette.background.level1,
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
      <div className={classes.topTabBar}>
        <TabBar />
      </div>
      <div className={classes.leftPane}>
        <CoursesPane />
      </div>
      <div className={classes.rightPane}>
        <Box
          py={2}
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px solid darkgrey"
          bgcolor="hsla(231, 42%, 39%, 1)"
          color="#f5f5f5"
          fontSize="h6.fontSize"
          fontWeight="fontWeightMedium"
        >
          PEERS
        </Box>
        <UserSearchForm />
      </div>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <div className={classes.contentArea}>
        <h3>Changing Content</h3>
        <Switch>
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
            <PublicChat />
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
