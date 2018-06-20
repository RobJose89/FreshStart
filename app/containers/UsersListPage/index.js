import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import moment from 'moment';
import { Set } from 'immutable';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class UsersListPage extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    users: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    users: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: Set(),
      isDialogOpen: false,
      editUserEmail: '',
      editUserPassword: '',
      editIsApi: false,
      editUserId: null,
    };

    this.removeRows = this.removeRows.bind(this);
    this.createUser = this.createUser.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.editRow = this.editRow.bind(this);
    this.editUser = this.editUser.bind(this);
    this.changeEditUserEmail = this.changeEditUserEmail.bind(this);
    this.changeEditUserPassword = this.changeEditUserPassword.bind(this);
    this.changeEditIsApi = this.changeEditIsApi.bind(this);
  }

  componentWillMount() {
    this.props.load();
  }

  resetSelectedRows() {
    this.setState((prevState) => ({
      ...prevState,
      selectedRows: Set(),
    }));
  }

  clickRow(id) {
    this.setState((prevState) => ({
      ...prevState,
      selectedRows: prevState.selectedRows
        .includes(id)
        ? prevState.selectedRows.remove(id)
        : prevState.selectedRows.add(id),
    }));
  }

  removeRow(id) {
    this.props.remove([id]);
    this.resetSelectedRows();
  }

  removeRows() {
    this.props.remove(
      this.state.selectedRows.toArray()
    );
    this.resetSelectedRows();
  }

  openDialog() {
    this.setState((prevState) => ({
      ...prevState,
      isDialogOpen: true,
    }));
  }

  closeDialog() {
    this.setState((prevState) => ({
      ...prevState,
      editUserEmail: '',
      editUserPassword: '',
      editIsApi: false,
      isDialogOpen: false,
      editUserId: null,
    }));
  }

  changeEditUserEmail(event) {
    const editUserEmail = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      editUserEmail,
    }));
  }

  changeEditUserPassword(event) {
    const editUserPassword = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      editUserPassword,
    }));
  }

  changeEditIsApi(event) {
    const editIsApi = event.target.checked;
    this.setState((prevState) => ({
      ...prevState,
      editIsApi,
    }));
  }

  canCreateUser() {
    return this.state.editUserEmail && this.state.editUserPassword;
  }

  canEditUser() {
    return this.state.editUserEmail;
  }

  editRow(id) {
    const selectedUser = this.props.users.reduce((acc, user) => user._id === id ? user : acc);
    this.setState((prevState) => ({
      ...prevState,
      isDialogOpen: true,
      editUserId: id,
      editUserEmail: selectedUser.email,
      editIsApi: selectedUser.isApi,
      editUserPassword: '',
    }));
  }

  createUser(event) {
    event.preventDefault();
    if (!this.canCreateUser()) {
      return;
    }
    this.props.create(this.state.editUserEmail, this.state.editUserPassword, this.state.editIsApi);
    this.closeDialog();
  }

  editUser(event) {
    event.preventDefault();
    if (!this.canEditUser()) {
      return;
    }
    this.props.edit(this.state.editUserId, this.state.editUserEmail, this.state.editUserPassword, this.state.editIsApi);
    this.closeDialog();
  }

  render() {
    const { classes } = this.props;
    const { selectedRows } = this.state;

    const users = this.props.users.sort((a, b) =>
      [b.email, a.email].sort()[0] === b.email ? 1 : -1
    );

    return (
      <div className={classes.wrapper}>
        <div className={classes.leftPanel}>
          <Paper className={classes.toolbar}>
            <div>
              {
                this.state.selectedRows.size > 0
                  ? (
                    <Tooltip title="Delete Selected" placement="top" id="remove-users">
                      <IconButton
                        onClick={this.removeRows}
                        aria-label="Delete Selected"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )
                  : (
                    <Tooltip title="Create a new user" placement="top" id="create-new-user">
                      <IconButton
                        onClick={this.openDialog}
                        aria-label="Create a new user"
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  )
              }
            </div>
            <div>
              <Tooltip title="Refresh" placement="top" id="refresh">
                <IconButton onClick={this.props.load} aria-label="Refresh">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
          <Paper className={classes.grid}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Selected</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date of last login</TableCell>
                  <TableCell>Last edit date</TableCell>
                  <TableCell><div style={{ textAlign: 'center' }}>External applications</div></TableCell>
                  <TableCell><div style={{ textAlign: 'center' }}>Action</div></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.props.error
                    ? (
                      <TableRow>
                        <TableCell colSpan="6">
                          <Typography align="center" color="error">
                            Error: <span />
                            {
                              typeof this.props.error === 'string'
                                ? this.props.error
                                : JSON.stringify(this.props.error)
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null
                }
                {
                  this.props.loading
                    ? (
                      <TableRow>
                        <TableCell colSpan="6">
                          <Typography align="center">
                            Loading ...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow
                          key={user._id}
                          data-id={user._id}
                          onClick={() => this.clickRow(user._id)}
                          role="checkbox"
                          aria-checked={selectedRows.contains(user._id)}
                          hover
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedRows.contains(user._id)} />
                          </TableCell>
                          <TableCell>
                            {user.email}
                          </TableCell>
                          <TableCell>
                            {
                              user.lastLogin
                                ? moment(user.lastLogin).format('MM/DD/YYYY HH:mm')
                                : <i>User has not logged in yet</i>
                            }
                          </TableCell>
                          <TableCell>
                            {moment(user.lastUpdate).format('MM/DD/YYYY HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Typography align="center">
                              {user.isApi ? 'Yes' : 'No'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                                <Tooltip title="Delete user" placement="top" id="remove-user">
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      this.removeRow(user._id);
                                    }}
                                    aria-label="Delete user"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit user" placement="top" id="edit-user">
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      this.editRow(user._id);
                                    }}
                                    aria-label="Edit user"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                }
              </TableBody>
            </Table>
          </Paper>
          <Dialog
            open={this.state.isDialogOpen}
            onClose={this.closeDialog}
            fullWidth
            aria-labelledby="create-user"
          >
            <form onSubmit={this.state.editUserId === null ? this.createUser : this.editUser}>
              <DialogTitle id="create-user">
                {
                  this.state.editUserId === null
                    ? 'Create a user'
                    : 'Update user'
                }
              </DialogTitle>
              <DialogContent>
                <TextField
                  margin="normal"
                  label="Email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={this.state.editUserEmail}
                  onChange={this.changeEditUserEmail}
                  autoFocus
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label={this.state.editUserId === null ? 'Password' : 'New password'}
                  type="password"
                  placeholder="***********"
                  value={this.state.editUserPassword}
                  onChange={this.changeEditUserPassword}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.editIsApi}
                      onChange={this.changeEditIsApi}
                    />
                  }
                  label="External application account"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeDialog} color="primary">
                  Cancel
                  </Button>
                <Button type="submit" color="primary" disabled={this.state.editUserId === null ? !this.canCreateUser() : !this.canEditUser()}>
                  OK
                  </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      </div>

    );
  }

}

// connect mapStateToProps
const withConnect = connect((state) => state.getIn(['usersList']).toJS(), actions);

const withReducer = injectReducer({ key: 'usersList', reducer });

const withSaga = injectSaga({ key: 'usersList', saga });

// Link a style sheet with a component. It does not modify the component passed to it; instead, it returns
// a new component with a classes property. This classes object contains the name of the class names injected in the DOM.
const withStyle = withStyles(styles, { withTheme: true });

// compose - Composes functions from right to left. http://redux.ruanyifeng.com/api/compose.html
export default compose(withStyle, withReducer, withSaga, withConnect)(UsersListPage);
