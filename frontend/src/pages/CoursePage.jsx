import React from 'react';
import { makeStyles, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const makePath = (path, course) => {
  return `/kudo/${course}${path}`;
};

const CoursePage = () => {
  const { params } = useRouteMatch('/kudo/:course');
  const course = params.course;

  const handleSubmit = e => {
    console.log('Form submitted!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Create Group</Button>
        <Switch>
          <Route path={makePath('/group/create', course)}>
            {() => (
              <div>
                <h1>{`Create group for ${course}`}</h1>
              </div>
            )}
          </Route>
          <Route path={makePath('/group/:group', course)}></Route>
          <Route path={makePath('/group/:group/settings', course)}></Route>
        </Switch>
      </form>
    </div>
  );
};

export { CoursePage };
