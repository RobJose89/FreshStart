import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core/Menu';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/ContentCopy';
import EditIcon from '@material-ui/icons/Edit';

import { Link as RawLink } from 'react-router-dom';
import moment from 'moment';
import { Set } from 'immutable';
import { load as loadMapsList } from 'containers/MapsListScreen/actions';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

const Link = styled(RawLink) `
  text-decoration: none;
`;

class SchoolYearsListScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    loadMapsList: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    mapsList: PropTypes.array,
    schoolYears: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    schoolYears: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: Set(),
      isDialogOpen: false,
      selectedMap: '_',
      schoolYearName: '',
    };

    this.removeRows = this.removeRows.bind(this);
    this.duplicateRows = this.duplicateRows.bind(this);
    this.selectMap = this.selectMap.bind(this);
    this.createSchoolYear = this.createSchoolYear.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.changeSchoolYearName = this.changeSchoolYearName.bind(this);
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

  duplicateRow(id) {
    this.props.duplicate([id]);
    this.resetSelectedRows();
  }

  duplicateRows() {
    this.props.duplicate(
      this.state.selectedRows.toArray()
    );
    this.resetSelectedRows();
  }

  openDialog() {
    this.props.loadMapsList();
    this.setState((prevState) => ({
      ...prevState,
      isDialogOpen: true,
    }));
  }

  closeDialog() {
    this.setState((prevState) => ({
      ...prevState,
      selectedMap: '_',
      schoolYearName: '',
      isDialogOpen: false,
    }));
  }

  changeSchoolYearName(event) {
    const schoolYearName = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      schoolYearName,
    }));
  }

  selectMap(event) {
    this.setState((prevState) => ({
      ...prevState,
      selectedMap: event.target.value,
    }));
  }

  canCreateSchoolYear() {
    return this.state.selectedMap !== '_' && !!this.state.schoolYearName;
  }

  createSchoolYear(event) {
    event.preventDefault();
    if (!this.canCreateSchoolYear()) {
      return;
    }
    this.props.create(this.state.selectedMap, this.state.schoolYearName);
    this.closeDialog();
  }

  render() {
    const { classes } = this.props;
    const { selectedRows } = this.state;
    const schoolYears = this.props.schoolYears.sort((a, b) =>
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );
    const maps = this.props.mapsList.sort((a, b) =>
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );

    return (
      <div className={classes.wrapper}>
        <div className={classes.leftPanel}>
          <Paper className={classes.toolbar}>
            <div>
              {
                this.state.selectedRows.size > 0
                  ? (
                    <div>
                      <Tooltip title="Delete Selected" placement="top" id="remove-school-year">
                        <IconButton
                          onClick={this.removeRows}
                          aria-label="Delete Selected"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate selected" placement="top" id="duplicate-school-year">
                        <IconButton
                          onClick={this.duplicateRows}
                          aria-label="Duplicate selected"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
                  : (
                    <Tooltip title="Create a new school year" placement="top" id="create-new-school-year">
                      <IconButton
                        onClick={this.openDialog}
                        aria-label="Create a new school year"
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
                  <TableCell>Name</TableCell>
                  <TableCell>Last edit date</TableCell>
                  <TableCell><div style={{ textAlign: 'center' }}>Action</div></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.props.error
                    ? (
                      <TableRow>
                        <TableCell colSpan="4">
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
                        <TableCell colSpan="4">
                          <Typography align="center">
                            Loading...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      schoolYears.map((schoolYear) => (
                        <TableRow
                          key={schoolYear._id}
                          data-id={schoolYear._id}
                          onClick={() => this.clickRow(schoolYear._id)}
                          role="checkbox"
                          aria-checked={selectedRows.contains(schoolYear._id)}
                          hover
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedRows.contains(schoolYear._id)} />
                          </TableCell>
                          <TableCell>
                            {schoolYear.name}
                          </TableCell>
                          <TableCell>
                            {moment(schoolYear.lastUpdate).format('D.M.YYYY HH:mm')}
                          </TableCell>
                          <TableCell>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                                <Tooltip title="Delete school year" placement="top" id="remove-school-year">
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      this.removeRow(schoolYear._id);
                                    }}
                                    aria-label="Delete school year"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Duplicate the school year" placement="top" id="duplicate-school-year">
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      this.duplicateRow(schoolYear._id);
                                    }}
                                    aria-label="Duplicate the school year"
                                  >
                                    <CopyIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit school year" placement="top" id="edit-school-year">
                                  <Link to={`/school-year/edit/${schoolYear._id}`}>
                                    <IconButton
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                      aria-label="Edit school year"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Link>
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
            aria-labelledby="create-school-year"
          >
            <form onSubmit={this.createSchoolYear}>
              <DialogTitle id="create-school-year">Create a school year</DialogTitle>
              <DialogContent>
                <TextField
                  margin="normal"
                  label="Name of the school year"
                  placeholder="2064/2065"
                  value={this.state.schoolYearName}
                  onChange={this.changeSchoolYearName}
                  autoFocus
                  fullWidth
                />
                <FormControl fullWidth margin="normal">
                  <Select
                    value={this.state.selectedMap}
                    onChange={this.selectMap}
                  >
                    <MenuItem value="_">
                      <em>Choose a map template</em>
                    </MenuItem>
                    {
                      maps.map((map) => (
                        <MenuItem
                          key={map._id}
                          value={map._id}
                        >
                          {map.name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeDialog} color="primary">
                  Cancel
                  </Button>
                <Button type="submit" color="primary" disabled={!this.canCreateSchoolYear()}>
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

const withConnect = connect((state) =>
  state.getIn(['schoolYearsList'])
    .set('mapsList', state.getIn(['mapsList', 'maps']))
    .toJS()
  , { ...actions, loadMapsList });

const withReducer = injectReducer({ key: 'schoolYearsList', reducer });
const withSaga = injectSaga({ key: 'schoolYearsList', saga });
const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(SchoolYearsListScreen);
