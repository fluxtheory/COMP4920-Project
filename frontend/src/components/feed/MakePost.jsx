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
  MakePostContainer: {
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

function MakePost() {
  const classes = useStyles();
  const session = React.useContext(Session);
  const username = session.user.id;
  const course = useParams().course;
  const [postMade, setPostMade] = React.useState(false);
  const [values, setValues] = React.useState({
    content: '',
    title: '',
    sticky: false,
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log({ username, values });
    api
      .post('/' + course + '/feed/post', {
        rootId: null,
        branchId: null,
        username,
        content: values.content,
        title: values.title,
        sticky: values.sticky ? 1 : 0,
      })
      .then(resp => {
        // job's done
        setPostMade(true);
      });
  };

  if (postMade === true) {
    return <Redirect to={'/kudo/' + course + '/feed'} />;
  }

  return (
    <div className={classes.MakePostContainer}>
      <Paper className={classes.root}>
        <form onSubmit={e => handleSubmit(e)}>
          <TextField
            name="title"
            label="Title"
            className={classes.textField}
            value={values.title}
            onChange={handleChange('title')}
            margin="normal"
            style={{ width: '60%' }}
            type="text"
            placeholder={'Hello ' + course + '!'}
            autoComplete="off"
            variant="outlined"
            required
          />
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
          <FormControlLabel
            control={
              <Checkbox
                checked={values.sticky}
                onChange={handleCheck('sticky')}
                value={values.sticky}
                color="primary"
              />
            }
            label="Sticky this post?"
          />
          <div align="right">
            <Button type="submit">Post</Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export { MakePost };
