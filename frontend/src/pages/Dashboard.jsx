import React from 'react';
import { makeStyles, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { CourseBox } from '../components/course/CourseBox';
import { PublicChat } from '../components/PublicChat';

const Dashboard = () => {
  if (!localStorage.hasOwnProperty('userToken')) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>welcome.</h1>
      <div>
        <CourseBox />
        {/*<PublicChat /> */};
      </div>
    </div>
  );
};

export { Dashboard };
