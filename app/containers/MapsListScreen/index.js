import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
import * as actions from './actions';
import styles from './styles';

const Link = styled(RawLink) `
  text-decoration: none;
`;

class MapsListScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    maps: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    maps: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: Set(),
    };

    this.removeRows = this.removeRows.bind(this);
    this.duplicateRows = this.duplicateRows.bind(this);
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

  render() {
    const { classes } = this.props;
    const { selectedRows } = this.state;
    const maps = this.props.maps.sort((a, b) =>
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
                      <Tooltip title="Delete Selected" placement="top" id="remove-maps">
                        <IconButton
                          onClick={this.removeRows}
                          aria-label="Delete Selected"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate selected" placement="top" id="duplicate-maps">
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
                    <Link to="/map/create">
                      <Tooltip title="Create a new map" placement="top" id="create-new-map">
                        <IconButton aria-label="Create a new map">
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>
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
                      maps.map((map) => (
                        <TableRow
                          key={map._id}
                          data-id={map._id}
                          onClick={() => this.clickRow(map._id)}
                          role="checkbox"
                          aria-checked={selectedRows.contains(map._id)}
                          hover
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedRows.contains(map._id)} />
                          </TableCell>
                          <TableCell>
                            {map.name}
                          </TableCell>
                          <TableCell>
                            {moment(map.lastUpdate).format('D.M.YYYY HH:mm')}
                          </TableCell>
                          <TableCell>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                                <Tooltip title="Smazat mapu" placement="top" id="remove-map">
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      this.removeRow(map._id);
                                    }}
                                    aria-label="Smazat mapu"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Duplikovat mapu" placement="top" id="duplicate-map">
                                  <IconButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      this.duplicateRow(map._id);
                                    }}
                                    aria-label="Duplikovat mapu"
                                  >
                                    <CopyIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Upravit mapu" placement="top" id="edit-map">
                                  <Link to={`/map/edit/${map._id}`}>
                                    <IconButton
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                      aria-label="Upravit mapu"
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
        </div>
      </div>

    );
  }

}

const withConnect = connect((state) => state.getIn(['mapsList']).toJS(), actions);
const withStyle = withStyles(styles, { withTheme: true });

export default compose(withConnect, withStyle)(MapsListScreen);
