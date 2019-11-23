import Axios from 'axios';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

const api = Axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(
  function(config) {
    const authToken = localStorage.getItem('userToken');
    config.headers.Authorization = authToken;

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const useCourse = () => {
  const { params } = useRouteMatch('/kudo/:course');
  return params.course;
};

const useCurrentPage = () => {
  // const { params } = useRouteMatch('/kudo/:course/:activePage');
  const match = useRouteMatch('/kudo/:course/:activePage');
  if (match) {
    return match.params.activePage;
  }

  return null;
};

export { api, useCourse, useCurrentPage };
