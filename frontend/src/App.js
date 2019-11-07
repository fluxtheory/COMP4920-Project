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
import { Kudo } from './pages/Kudo';

const useStyles = makeStyles({});

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
            <AuthProtection>
              {/* This is our entire application once logged in */}
              <Kudo />
            </AuthProtection>
          </Route>
          {/* TODO: REMOVE THIS */}
          <Route path="/ui">
            <UITest />
          </Route>
        </Switch>
        <div>
          <nav>
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
        </div>
      </Router>
    </Chatkit.Provider>
  );
}

export default App;
