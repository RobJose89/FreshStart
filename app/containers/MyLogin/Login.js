import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { TextField } from 'redux-form-material-ui';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';

import { authenticateUser } from './authenticationJwtActions';
import { createDataToAuthentication } from './applicationContext';
import { required, alphaNumeric, email } from 'utils/fieldLevelValidations';
import styles from './styles';

class Login extends Component {
  onSubmit(values) {
    console.log('onSubmit: ', values);
    this.props.authenticateUser(createDataToAuthentication(values.username, values.password));
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { isUserAuthenticated, err } = this.props.authentication;
    const { classes } = this.props;
    console.log('login -- props: ', this.props);
    if (isUserAuthenticated) {
      return (<Redirect to={from} />);
    }

    const { handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Grid container direction="column" alignItems="center" spacing={16}>
          <Grid item xs>
            <Typography variant="body2" className={classes.loginError}>
              {/* TODO revise err */}
              {err ? (err.response
                ? `${err.response.data} ${err.response.status} ${err.response.statusText}`
                : 'Error logging in, please try again.') : ''}
            </Typography>
          </Grid>
          <Card className={classes.card}>
            <Grid className={classes.titleBar} container justify="center" >
              <AccountCircleIcon className={classes.icon}>account_circle</AccountCircleIcon>
            </Grid>
            <CardContent>
              <Field
                className={classes.loginForm}
                label="Login"
                name="username"
                type="text"
                autoFocus
                component={TextField}
                fullWidth
                validate={[required, email]}
              />
              <Field
                className={classes.loginForm}
                label="Password"
                name="password"
                type="password"
                component={TextField}
                validate={[required]}
                fullWidth
              />
            </CardContent>
            <CardActions>
              <Button fullWidth color="primary" type="submit" disabled={submitting}>Log in</Button>
            </CardActions>
          </Card>
        </Grid>
      </form>
    );
  }
}

const materialUIEnhance = withStyles(styles)(Login);
const mapStateToProps = ({ authentication }) => ({ authentication });
const reduxEnhance = connect(mapStateToProps, { authenticateUser })(materialUIEnhance);

export default reduxForm({ form: 'LoginForm' })(reduxEnhance);
