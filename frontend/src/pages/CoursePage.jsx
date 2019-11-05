import React from 'react';
import { makeStyles, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';

const CoursePage = () => {

    const handleSubmit = e => {
        console.log("Form submitted!");
        
    };

    return <div>
        <form onSubmit={handleSubmit}>
        <Button type="submit">Create Group</Button>
        </form>
    </div>
}

export { CoursePage };