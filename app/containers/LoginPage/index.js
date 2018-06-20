import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class LoginPage extends React.PureComponent {

  static propTypes = {
    login: PropTypes.func.isRequired,
    inProgress: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.inProgress && !nextProps.inProgress) {
      this.setState({
        ...this.state,
        password: '',
      });
    }
  }

  handleLogin(event) {
    const { login } = this.props;
    event.preventDefault();
    login(this.state.email, this.state.password);
  }

  handleEmail(event) {
    this.setState({
      ...this.state,
      email: event.target.value,
    });
  }

  handlePassword(event) {
    this.setState({
      ...this.state,
      password: event.target.value,
    });
  }

  render() {
    const { inProgress, error, classes } = this.props;
    const { email, password } = this.state;

    const defaultErrorMessage = typeof error === 'string' ? error : null;
    const emailError = error && error.email ? error.email : defaultErrorMessage;
    const passwordError = error && error.password ? error.password : defaultErrorMessage;

    return (

      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <form onSubmit={this.handleLogin}>
            <Typography variant="headline">Login</Typography>
            <TextField
              autoFocus
              id="email"
              label="E-mail"
              placeholder="hhusfelt@gmail.com"
              value={email}
              onChange={this.handleEmail}
              className={classes.textField}
              margin="normal"
              fullWidth
              error={!!error}
              helperText={emailError}
            />
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="********"
              value={password}
              onChange={this.handlePassword}
              className={classes.textField}
              margin="normal"
              fullWidth
              error={!!error}
              helperText={passwordError}
            />
            <div className={classes.buttonContainer}>
              <Button type="submit" color="primary" disabled={inProgress}>
                Log in
                </Button>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

const withConnect = connect((state) => state.get('login').toJS(), actions);
const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });
const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(LoginPage);
