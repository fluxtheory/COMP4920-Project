import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Login } from './pages/Login';
import { CreateAccount } from './pages/CreateAccount';
import { Dashboard } from './pages/Dashboard';
import { CoursePage } from './pages/CoursePage';
import { makeStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProtection } from './components/AuthProtection';
import { UITest } from './pages/UITest';

const useStyles = makeStyles({
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
});

export const Chatkit = React.createContext({
  user: null,
  updateUser: () => {},
});

function App() {
  const classes = useStyles();

  const updateUser = user => setChatkitState({ ...chatkitState, user: user });

  const initState = {
    user: null,
    updateUser,
  };

  const [chatkitState, setChatkitState] = React.useState(initState);

  return (
    <Chatkit.Provider value={chatkitState}>
      <Router className={classes.body}>
        <CssBaseline />
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
            {chatkitState.user ? (
              <button
                onClick={e => {
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('username');
                  updateUser(null);
                }}
              >
                Logout
              </button>
            ) : null}
          </nav>
          <div className={classes.kudoApp}>
            <div className={classes.topTabBar}>Tab Bar</div>
            <div className={classes.leftPane}>Courses Pane</div>
            <div className={classes.rightPane}>Chat Pane</div>
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <div className={classes.contentArea}>
              <h3>Changing Content</h3>
              <Switch>
                <Route path="/ui">
                  <UITest />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/dashboard">
                  <AuthProtection>
                    <Dashboard />
                  </AuthProtection>
                </Route>
                <Route path="/createAccount">
                  <CreateAccount />
                </Route>
                <Route path={['/chat/:id', '/chat']}>
                  <AuthProtection>
                    <Chat />
                  </AuthProtection>
                </Route>
                <Route path={['/courses/:course']}>
                  <AuthProtection>
                    <CoursePage />
                  </AuthProtection>
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </Chatkit.Provider>
  );
}

export default App;
