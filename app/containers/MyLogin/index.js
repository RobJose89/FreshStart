import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import { required, email } from 'utils/fieldLevelValidations';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class LoginPage extends PureComponent {
  onSubmit(values) {
    console.log('onSubmit: ', values.toJS());
    const { login } = this.props;
    const { username, password } = values.toJS();
    login(username, password);
  }

  render() {
    const err = 'test';
    const { classes } = this.props;

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

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const withConnect = connect((state) => state.get('login').toJS(), actions);
const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });
const withStyle = withStyles(styles, { withTheme: true });

const theForm = reduxForm({ form: 'LoginForm' })(LoginPage);

export default compose(withStyle, withReducer, withSaga, withConnect)(theForm);
