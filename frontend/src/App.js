import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Login } from './pages/Login';
import { CreateAccount } from './pages/CreateAccount';
import { Dashboard } from './pages/Dashboard';
import { makeStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProtection } from './components/AuthProtection';

const useStyles = makeStyles({
  body: {
    body: {
      backgroundColor: 'papayawhip',
    },
  },
});

export const Chatkit = React.createContext({
  user: null,
  updateUser: () => { },
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
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
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
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </Chatkit.Provider >
  );
}

export default App;
