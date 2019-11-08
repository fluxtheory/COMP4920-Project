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
import { ChatPane } from '../components/ChatPane';
import { classes } from 'istanbul-lib-coverage';

const useStyles = makeStyles(theme => ({
  kudoApp: {
    display: 'grid',
    // gridGap: '1rem',
    gridTemplateColumns: '1.5fr 8fr 1.5fr',
    gridTemplateRows: '1fr 15fr',
    gridTemplateAreas: `"leftTitle tabs rightTitle"
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

  leftPaneTitle: {
    gridArea: 'leftTitle',
  },
  leftPane: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'left',
    background: 'blue',
  },

  rightPaneTitle: {
    gridArea: 'rightTitle',
  },
  rightPane: {
    gridArea: 'right',
    background: theme.palette.background.level2,
    display: 'flex',
  },

  contentArea: {
    gridArea: 'middle',
    background: theme.palette.background.level1,
  },
}));

const Kudo = () => {
  const classes = useStyles();

  return (
    <div className={classes.kudoApp}>
      <SacredTopBar />
      <SacredLeftPane />
      <SacredRightPane />
      <PlebbyChangingContent />
    </div>
  );
};

const SacredLeftPane = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <PaneTitle title="COURSES" className={classes.leftPaneTitle} />
      <div className={classes.leftPane}>
        <CoursesPane />
      </div>
    </React.Fragment>
  );
};

const SacredRightPane = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <PaneTitle title="PEERS" className={classes.rightPaneTitle} />
      <div className={classes.rightPane}>
        <ChatPane />
      </div>
    </React.Fragment>
  );
};

const SacredTopBar = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.topTabBar}>
        <TabBar />
      </div>
    </React.Fragment>
  );
};

const PlebbyChangingContent = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

// TODO: we can potentially even get rid of the kudo prefix
const makePath = path => {
  return `/kudo${path}`;
};
const PaneTitle = ({ title, ...props }) => {
  return (
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
      {...props}
    >
      {title}
    </Box>
  );
};

export { Kudo };
