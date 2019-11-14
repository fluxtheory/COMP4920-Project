import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';
import { useParams } from 'react-router-dom';
import { api } from '../../utils';
import { Session } from '../../App';
import { Redirect } from 'react-router-dom';

/*
// @route POST /:course/feed/post
// @desc Add/reply to a post in the course topic feed.
// @body parentId, username, content
// @access private
router.post("/:course/feed/post", (req, res) => {
    const { parentId, username, content } = req.body;
  
    feeddb
      .addPost(parentId, username, req.params.course, content)
      .then(reply => {
        return res.status(reply.code).json(reply);
      })
      .catch(err => {
        return res.status(err.code).json(err);
      });
  });
*/
const useStyles = makeStyles(theme => ({
  MakePostContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function MakePost() {
  const classes = useStyles();
  const session = React.useContext(Session);
  const username = session.user.id;
  const course = useParams().course;
  const [postMade, setPostMade] = React.useState(false);
  const [values, setValues] = React.useState({
    content: '',
    title: '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
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
      })
      .then(resp => {
        // job's done
        setPostMade(true);
      });
  };

  if (postMade === true) {
    return <Redirect to={'/' + course + '/feed'} />;
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
          <div align="right">
            <Button type="submit">Post</Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export { MakePost };
