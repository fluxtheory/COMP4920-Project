import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';
import { useParams } from 'react-router-dom';
import { api } from '../../utils';
import { Session } from '../../App';
import { Redirect } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  MakeCommentContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const getUserInfo = function(username) {
  return new Promise((resolve, reject) => {
    api
      .post('/user', { usernames: [username] })
      .then(resp => {
        console.log(resp);
        if (resp.statusText === 'OK') resolve(resp.data[0]);
        else resolve({});
      })
      .catch(err => {
        console.log(err);
        reject([]);
      });
  });
};

function MakeComment(props) {
  const classes = useStyles();
  const session = React.useContext(Session);
  const username = session.user.id;
  const course = useParams().course;
  const rootId = props.rootId;
  const branchId = props.branchId;
  const [postMade, setPostMade] = React.useState(false);
  const [rank, setRank] = React.useState(3);
  const [values, setValues] = React.useState({
    content: '',
    title: '',
  });

  React.useEffect(() => {
    const prom = getUserInfo(username).then(resp => {
      console.log(resp);
      console.log(resp.rank);
      setRank(resp.rank);
    });
  }, [username]);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log({ username, values });
    api
      .post('/' + course + '/feed/post', {
        rootId,
        branchId,
        username,
        content: values.content,
        title: values.title,
        sticky: 0,
      })
      .then(resp => {
        // job's done
        setPostMade(true);
      });
  };

  if (postMade === true) {
    return <Redirect to={'/kudo/' + course + '/post/' + rootId} />;
  }

  return (
    <div className={classes.MakeCommentContainer}>
      <Paper className={classes.root}>
        <form onSubmit={e => handleSubmit(e)}>
          <TextField
            id="outlined-multiline-static"
            label="Content"
            style={{ width: '100%' }}
            multiline
            placeholder="I was just wondering about..."
            rows="4"
            rowsMax="18"
            value={values.content}
            onChange={handleChange('content')}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <div align="right">
            <Button type="submit">Comment</Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export { MakeComment };
