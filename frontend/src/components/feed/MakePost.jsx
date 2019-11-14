import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';

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

const handleSubmit = e => {
  e.preventDefault();
};

function MakePost() {
  const classes = useStyles();

  return (
    <div className={classes.MakePostContainer}>
      <Paper className={classes.root}>
        <form onSubmit={e => handleSubmit(e)}>
          <TextField
            id="name"
            name="name"
            label="Name"
            className={classes.textField}
            //value={values.name}
            //onChange={handleChange('name')}
            margin="normal"
            type="text"
            placeholder="aashwin"
            autoComplete="off"
            required
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
