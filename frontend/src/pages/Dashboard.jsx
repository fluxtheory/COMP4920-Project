import React from 'react';
import { makeStyles, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const Dashboard = () => {
  if (localStorage.getItem('userToken') === null) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <h1>welcome.</h1>
    </div>
  );
};

export { Dashboard };
