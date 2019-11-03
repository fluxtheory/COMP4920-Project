import React from 'react';
import { makeStyles, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { CourseList } from '../components/CourseList';
import { PublicChat } from '../components/PublicChat';

const Dashboard = () => {
  return (
    <div>
      <h1>welcome.</h1>
      <div>
        <CourseList />
        <PublicChat />
      </div>
    </div>
  );
};

export { Dashboard };
