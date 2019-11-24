import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Login } from './pages/Login';
import { CreateAccount } from './pages/CreateAccount';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProtection } from './components/AuthProtection';
import { UITest } from './pages/UITest';
import { Kudo } from './pages/Kudo';
import { CoursesPane } from './components/course/CoursesPane';
import { createMuiTheme } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles({});

export const Session = React.createContext({
  user: null,
  updateUser: () => {},
});

export const NewGroupTrigger = React.createContext({
  subscription: {},
  trigger: () => {},
});

export const CurrentUser = React.createContext({
  username: null,
  admin: null,
  updateCurrentUser: () => {},
});

export const theme = createMuiTheme({
  /*
//THEME ONE - Green and gold
  type: 'dark',
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#4a9878',
    },
    secondary: {
      main: '#9c7a22',
    },
    background: {
      level1: '#1e3f4a',
      level2: '#16333d',
      level3: '#0a191e',
    },
  },
  shadows: ['none'],
  */
  /*
 // THEME TWO - Bubblegum
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#0646cf',
    },
    secondary: {
      main: '#ff00ae',
    },
    background: {
      level1: '#ffffff',
      level2: '#ffffff',
      level3: '#ffffff',
    },
    text: {
      title: '#000000',
      subtitle: '#000000',
      footer: '#000000',
    },
  },
  shadows: ['none'],
  */
  /*
 //THEME THREE - Walnut/Woodland
  shape: {
  borderRadius: 0,
},
palette: {
  primary: {
    main: '#402b1b',
  },
  secondary: {
    main: '#9e4d10',
  },
  background: {
    level1: '#f5ede9',
    level2: '#e6d8cf',
    level3: '#d1beb0',
  },
  text: {
    title: '#000000',
    subtitle: '#000000',
    footer: '#000000',
  },
},
shadows: ['none'],
*/
  // default
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#631976',
    },
    background: {
      background: {
        level1: '#fff',
        level2: '#f5f5f5',
        level3: '#f1f1f1',
      },
      text: {
        title: '#000000',
        subtitle: '#000000',
        footer: '#000000',
      },
    },
  },
  shadows: ['none'],
});

function App() {
  const classes = useStyles();

  const updateKudoUser = user =>
    setCurrUserState({ ...currUserState, ...user });
  const initCurrUserState = {
    username: null,
    admin: null,
    updateCurrentUser: updateKudoUser,
  };

  const updateUser = user => setSessionState({ ...sessionState, user: user });
  const initSessionState = {
    user: null,
    admin: false,
    updateUser,
  };

  // Not my proudest moment guys, but what must be done, must be done.
  const triggerState = {
    subscription: {},
    trigger: () => setNewGroupTrigger({ ...newGroupTrigger, subscription: {} }),
  };

  const [newGroupTrigger, setNewGroupTrigger] = React.useState(triggerState);
  const [sessionState, setSessionState] = React.useState(initSessionState); // chatkit user
  const [currUserState, setCurrUserState] = React.useState(initCurrUserState); // kudo user

  document.body.style = 'background: ' + theme.palette.background.level3;
  return (
    <ThemeProvider theme={theme}>
      <Session.Provider value={sessionState}>
        <CurrentUser.Provider value={currUserState}>
          <NewGroupTrigger.Provider value={newGroupTrigger}>
            <Router className={classes.body}>
              <CssBaseline />
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/createAccount">
                  <CreateAccount />
                </Route>
                <Route path="/kudo">
                  {/* This is our entire application once logged in */}
                  <AuthProtection>
                    <Kudo />
                  </AuthProtection>
                </Route>
                {/* TODO: REMOVE THIS */}
                <Route path="/ui">
                  <UITest />
                </Route>
                <Route path="/courses">
                  <CoursesPane />
                </Route>
              </Switch>
              <div>
                <nav>
                  {/*}
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/kudo/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/kudo/chat">Chat</Link>
                    </li>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    {/* TODO: Remove everything below here
                    <li>
                      <Link to="/kudo/comp">dummy course dash</Link>
                    </li>
                    <li>
                      <Link to="/kudo/comp/chat">dummy course chat</Link>
                    </li>
                    <li>
                      <Link to="/kudo/comp/feed">dummy course feed</Link>
                    </li>
                    <li>
                      <Link to="/kudo/comp/group">dummy course group chat</Link>
                    </li>
                    <li>
                      <Link to="/kudo/comp/group/settings">
                        dummy course group chat settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/kudo/comp/dm">dummy course private chat</Link>
                    </li>
                  </ul>
                    </Router>*/}
                </nav>
              </div>
            </Router>
          </NewGroupTrigger.Provider>
        </CurrentUser.Provider>
      </Session.Provider>
    </ThemeProvider>
  );
}

export default App;
