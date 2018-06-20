import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import TableIcon from '@material-ui/icons/Reorder';
import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import GridIcon from '@material-ui/icons/GridOn';
import ClassesIcon from '@material-ui/icons/People';
import RemoveClassIcon from '@material-ui/icons/RemoveCircleOutline';
import AddClassIcon from '@material-ui/icons/AddCircleOutline';
import OrderedSortIcon from '@material-ui/icons/SortByAlpha';
import RandomSortIcon from '@material-ui/icons/Shuffle';
import CenterMapIcon from '@material-ui/icons/CenterFocusStrong';

import ApplicationFrame from 'components/ApplicationFrame';
import Grid from 'components/Grid';
import Frame from 'react-frame-component';
import { fromJS, OrderedMap } from 'immutable';
import classNames from 'classnames';
import Random from 'random-js';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

const injectBorder = (elem) => (props) => {
  const newProps = { ...props };
  delete newProps.children;
  return elem({ ...props, style: { ...props.style, border: 'solid 2px black', padding: '5px' } }, props.children);
};

const Th = injectBorder(React.createFactory('th'));

const Td = injectBorder(React.createFactory('td'));

class EditSchoolYear extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    updateLockers: PropTypes.func.isRequired,
    updateClasses: PropTypes.func.isRequired,
    loadInitialData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    lockers: PropTypes.object,
    classesList: PropTypes.object,
    _id: PropTypes.string,
  }

  static zoomCoefficient = 1.1;

  constructor(props) {
    super(props);
    this.state = {
      map: fromJS({
        scale: 1,
        x: 0,
        y: 0,
      }),
      lastUsedLockerId: null,
      isTable: false,
      tableShuffleSeed: null,
      isClassesDialogOpen: false,
      isPrintDialogOpen: false,
    };

    this.initialize();

    this.mapMove = this.mapMove.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.lockerSelect = this.lockerSelect.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.openPrintDialog = this.openPrintDialog.bind(this);
    this.closePrintDialog = this.closePrintDialog.bind(this);
    this.openClassesDialog = this.openClassesDialog.bind(this);
    this.closeClassesDialog = this.closeClassesDialog.bind(this);
    this.changeClassName = this.changeClassName.bind(this);
    this.changeClassSize = this.changeClassSize.bind(this);
    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
    this.save = this.save.bind(this);
    this.wheel = this.wheel.bind(this);
    this.changeLockerOccupation = this.changeLockerOccupation.bind(this);
    this.changeLockerNote = this.changeLockerNote.bind(this);
    this.printFullTable = this.printFullTable.bind(this);
    this.printClassesTable = this.printClassesTable.bind(this);
    this.showMap = this.showMap.bind(this);
    this.showTable = this.showTable.bind(this);
    this.sortTable = this.sortTable.bind(this);
    this.shuffleTable = this.shuffleTable.bind(this);
  }

  initialize() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.loadInitialData(id);
    }
  }

  lockerSelect(id) {
    this.setState((prevState) => {
      this.props.updateLockers(
        this.props.lockers
          .map((locker, bid) =>
            locker.set('isActive', bid === id)
              .set('name', locker.get('name').trim())
          )
      );

      return {
        ...prevState,
        lastUsedLockerId: id,
      };
    });
  }

  mapMove({ x, y }) {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('x', x)
        .set('y', y),
    }));
  }

  centerMap() {
    this.mapMove({ x: 0, y: 0 });
  }

  zoomIn() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') * EditSchoolYear.zoomCoefficient),
    }));
  }

  zoomOut() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') / EditSchoolYear.zoomCoefficient),
    }));
  }

  save(event) {
    event.preventDefault();

    this.props.edit(
      this.props._id,
      this.clearLockers(this.props.lockers).toJS(),
      this.props.classesList.toJS(),
    );
  }

  wheel(event) {
    if (event.nativeEvent.deltaY < 0) {
      this.zoomOut();
      return;
    }
    this.zoomIn();
  }

  changeLockerOccupation(lockerId) {
    return (event) => {
      const occupation = event.target.value;
      this.props.updateLockers(
        this.props.lockers
          .setIn([lockerId, 'occupation'], occupation)
      );
    };
  }

  changeLockerNote(lockerId) {
    return (event) => {
      const note = event.target.value;
      this.props.updateLockers(
        this.props.lockers
          .setIn([lockerId, 'note'], note)
      );
    };
  }

  clearLockers(lockers) {
    return lockers.map((locker) =>
      locker.delete('isActive')
    );
  }

  printFullTable() {
    this.sortTable();
    this.closePrintDialog();
    window.setTimeout(() => window.frames.listFrame.print(), 1000);
  }

  printClassesTable() {
    this.shuffleTable();
    this.closePrintDialog();
    window.setTimeout(() => window.frames.classesListFrame.print(), 1000);
  }

  showMap() {
    this.setState((prevState) => ({
      ...prevState,
      isTable: false,
    }));
  }

  showTable() {
    this.setState((prevState) => ({
      ...prevState,
      isTable: true,
    }));
  }

  sortTable() {
    this.setState((prevState) => ({
      ...prevState,
      tableShuffleSeed: null,
    }));
  }

  shuffleTable() {
    this.setState((prevState) => ({
      ...prevState,
      tableShuffleSeed: Random.integer(0, 100000)(Random.engines.nativeMath),
    }));
  }

  openClassesDialog() {
    this.setState((prevState) => ({
      ...prevState,
      isClassesDialogOpen: true,
    }));
  }

  closeClassesDialog() {
    this.setState((prevState) => {
      this.props.updateClasses(
        this.props.classesList.filter((classData) =>
          classData.get('name') && classData.get('size')
        )
      );
      return {
        ...prevState,
        isClassesDialogOpen: false,
      };
    });
  }

  changeClassName(id) {
    return (event) => {
      const { value } = event.target;
      this.props.updateClasses(
        this.props.classesList.setIn([id, 'name'], value)
      );
    };
  }

  changeClassSize(id) {
    return (event) => {
      const { value } = event.target;
      this.props.updateClasses(
        this.props.classesList.setIn([id, 'size'], value)
      );
    };
  }

  addClass() {
    this.props.updateClasses(
      this.props.classesList
        .push(fromJS({
          name: '',
          size: '',
        }))
    );
  }

  removeClass(id) {
    return () =>
      this.props.updateClasses(
        this.props.classesList.delete(id)
      );
  }

  openPrintDialog() {
    this.setState((prevState) => ({
      ...prevState,
      isPrintDialogOpen: true,
    }));
  }

  closePrintDialog() {
    this.setState((prevState) => ({
      ...prevState,
      isPrintDialogOpen: false,
    }));
  }

  render() {
    const { classes } = this.props;
    const activeLocker = this.state.lastUsedLockerId !== null && this.props.lockers.get(this.state.lastUsedLockerId)
      ? this.props.lockers.get(this.state.lastUsedLockerId).toJS()
      : null;
    const lockers = this.state.tableShuffleSeed === null
      ?
        this.props.lockers.sort((a, b) =>
          [b.get('name'), a.get('name')].sort()[0] === b.get('name') ? 1 : -1
        )
      :
        Random.shuffle(
          Random.engines.mt19937().seed(this.state.tableShuffleSeed),
          this.props.lockers.map((locker, id) => locker.set('__id', id)).toArray()
        )
        .reduce((acc, locker) =>
          acc.set(locker.get('__id'), locker.delete('__id'))
        , OrderedMap());

    return (
      <ApplicationFrame title="Edit school year">
        <div className={classes.wrapper}>
          <div className={classNames(classes.leftPanel, { [classes.hideLeftPanel]: this.state.isTable })}>
            <Paper className={classes.toolbar}>
              {
                this.state.isTable
                  ? (
                    <div className={classes.toolbarContent}>
                      <Tooltip title="View the map" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.showMap} aria-label="View the map">
                          <GridIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                      {
                        this.state.tableShuffleSeed === null
                          ? (
                            <Tooltip title="Sort the table randomly" placement="top">
                              <IconButton className={classes.toolbarIconButton} onClick={this.shuffleTable} aria-label="Sort the table randomly">
                                <RandomSortIcon className={classes.toolbarIcon} />
                              </IconButton>
                            </Tooltip>
                          )
                          : (
                            <Tooltip title="Sort table by alphabet" placement="top">
                              <IconButton className={classes.toolbarIconButton} onClick={this.sortTable} aria-label="Sort table by alphabet">
                                <OrderedSortIcon className={classes.toolbarIcon} />
                              </IconButton>
                            </Tooltip>
                          )
                      }
                      <Tooltip title="Manage classes" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.openClassesDialog} aria-label="Manage classes">
                          <ClassesIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
                  : (
                    <div className={classes.toolbarContent}>
                      <Tooltip title="View list" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.showTable} aria-label="View list">
                          <TableIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom in" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.zoomIn} aria-label="Zoom in">
                          <ZoomInIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom out" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.zoomOut} aria-label="Zoom out">
                          <ZoomOutIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Return map to center" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.centerMap} aria-label="Return map to center">
                          <CenterMapIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Manage classes" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.openClassesDialog} aria-label="Manage classes">
                          <ClassesIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
              }
              <div className={classes.toolbarContent}>
                <Tooltip title="Print" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.openPrintDialog} aria-label="Print">
                    <PrintIcon className={classes.toolbarIcon} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.save} aria-label="Save">
                    <SaveIcon className={classes.toolbarIcon} color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
            <Paper
              className={classes.grid}
              onWheel={this.wheel}
            >
              <Frame name="listFrame" id="listFrame" style={{ display: 'none' }}>
                <h1 style={{ textAlign: 'center' }}>
                List of cabinets for the school year {this.props.name}
                </h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                  <tbody>
                    <tr>
                      <Th style={{ width: '25%' }}>
                      Cabinet name
                      </Th>
                      <Th style={{ width: '37.5%' }}>
                      Disciple
                      </Th>
                      <Th style={{ width: '37.5%' }}>
                        Note
                      </Th>
                    </tr>
                    {
                      lockers.map((locker, id) => (
                        <tr key={id}>
                          <Td>{locker.get('name')}</Td>
                          <Td>{locker.get('occupation')}</Td>
                          <Td>{locker.get('note')}</Td>
                        </tr>
                      )).toArray()
                    }
                  </tbody>
                </table>
              </Frame>
              <Frame name="classesListFrame" id="classesListFrame" style={{ display: 'none' }}>
                {
                  this.props.classesList
                    .reduce((acc, classData) =>
                      acc.set(
                        'classes',
                        acc.get('classes').push(
                          classData.set(
                            'lockers',
                            lockers.toArray().slice(
                              acc.get('count'),
                              acc.get('count') + Number(classData.get('size')),
                            )
                          )
                        )
                      )
                      .set('count', acc.get('count') + Number(classData.get('size')))
                    , fromJS({ classes: [], count: 0 }))
                    .get('classes')
                    .map((classData, cid) => (
                      <div key={cid} >
                        <h1 style={{ textAlign: 'center' }}>
                          Seznam skříněk pro třídu {classData.get('name')}
                        </h1>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                          <tbody>
                            <tr>
                              <Th style={{ width: '4%' }}>
                                #
                              </Th>
                              <Th style={{ width: '20%' }}>
                                Skříňka
                              </Th>
                              <Th style={{ width: '38%' }}>
                                Žák
                              </Th>
                              <Th style={{ width: '38%' }}>
                                Poznámka
                              </Th>
                            </tr>
                            {
                              classData.get('lockers')
                                .map((locker, lid) => (
                                  <tr key={lid}>
                                    <Td>{lid + 1}</Td>
                                    <Td>{locker.get('name')}</Td>
                                    <Td>{locker.get('occupation')}</Td>
                                    <Td>{locker.get('note')}</Td>
                                  </tr>
                                ))
                            }
                          </tbody>
                        </table>
                        <div style={{ pageBreakAfter: 'always' }}>&nbsp;</div>
                      </div>
                    ))
                    .toArray()
                }
              </Frame>
              {
                this.state.isTable
                  ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            Název skříňky
                          </TableCell>
                          <TableCell>
                            Žák
                          </TableCell>
                          <TableCell>
                            Poznámka
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          lockers.map((locker, id) => (
                            <TableRow key={id}>
                              <TableCell>
                                <Typography>
                                  {locker.get('name')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={locker.get('occupation')}
                                  onChange={this.changeLockerOccupation(id)}
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={locker.get('note')}
                                  onChange={this.changeLockerNote(id)}
                                  multiline
                                  rows={3}
                                  fullWidth
                                />
                              </TableCell>
                            </TableRow>
                          )).toArray()
                        }
                      </TableBody>
                    </Table>
                  )
                  : (
                    <Grid
                      mapOffsetX={this.state.map.get('x')}
                      mapOffsetY={this.state.map.get('y')}
                      boxes={lockers.toJS()}
                      scale={this.state.map.get('scale')}
                      onBoxSelect={this.lockerSelect}
                      onMapMove={this.mapMove}
                      disableBoxMovement
                    />
                  )
              }
            </Paper>
          </div>
          <Paper className={classNames(classes.panel, { [classes.hidePanel]: this.state.isTable })}>
            {
              activeLocker === null
              ? (
                <div>
                  <Typography variant="title" paragraph>Modify the cabinet</Typography>
                  <Typography variant="subheading" paragraph>Select the cabinet</Typography>
                </div>
              ) : (
                <div>
                  <Typography variant="title" paragraph>Modify the cabinet: {activeLocker.name}</Typography>
                  <Typography>
                    X: {-activeLocker.x / Grid.boxSize}<br />
                    Y: {-activeLocker.y / Grid.boxSize}
                  </Typography>
                  <TextField
                    label="Žák"
                    margin="normal"
                    value={activeLocker.occupation}
                    onChange={this.changeLockerOccupation(this.state.lastUsedLockerId)}
                  />
                  <TextField
                    margin="normal"
                    label="Poznámka"
                    value={activeLocker.note}
                    onChange={this.changeLockerNote(this.state.lastUsedLockerId)}
                    multiline
                    rows={3}
                  />
                </div>
              )
            }
          </Paper>
        </div>
        <Dialog
          open={this.state.isClassesDialogOpen}
          onClose={this.closeClassesDialog}
          fullWidth
          aria-labelledby="manage-classes"
        >
          <DialogTitle id="manage-class">Spravovat třídy</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Třída
                  </TableCell>
                  <TableCell>
                    Počet žáků
                  </TableCell>
                  <TableCell>
                    Akce
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.props.classesList
                    .map((classData, id) => (
                      <TableRow key={id}>
                        <TableCell>
                          <TextField
                            placeholder="V3A"
                            value={classData.get('name')}
                            onChange={this.changeClassName(id)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            placeholder="23"
                            value={classData.get('size')}
                            onChange={this.changeClassSize(id)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton className={classes.removeClassButton} onClick={this.removeClass(id)} aria-label="Smazat třídu">
                            <RemoveClassIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                    .toArray()
                }
                <TableRow>
                  <TableCell>
                    &nbsp;
                  </TableCell>
                  <TableCell>
                    &nbsp;
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Přidat třídu" placement="top">
                      <IconButton className={classes.addClassButton} onClick={this.addClass} aria-label="Přidat třídu">
                        <AddClassIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeClassesDialog} color="primary">
              Zavřít
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.isPrintDialogOpen}
          onClose={this.closePrintDialog}
          fullWidth
          aria-labelledby="manage-print"
        >
          <DialogTitle id="manage-print">Tisk:</DialogTitle>
          <List component="nav">
            <ListItem button divider onClick={this.printClassesTable}>
              <ListItemText primary="Seznam skříněk po třídách" />
            </ListItem>
            <ListItem button divider onClick={this.printFullTable}>
              <ListItemText primary="Seznam všech skříněk" />
            </ListItem>
            <ListItem button onClick={this.closePrintDialog}>
              <ListItemText primary="Zavřít" />
            </ListItem>
          </List>
        </Dialog>
      </ApplicationFrame>
    );
  }

}

const withConnect = connect((state) =>
  state.get('editSchoolYear')
    .delete('classes')
    .set('classesList', state.getIn(['editSchoolYear', 'classes']))
    .toObject()
, actions);

const withReducer = injectReducer({ key: 'editSchoolYear', reducer });

const withSaga = injectSaga({ key: 'editSchoolYear', saga });

const withStyle = withStyles(styles, { withTheme: true, stylesPropName: 'classNames' });

export default compose(withStyle, withReducer, withSaga, withConnect)(EditSchoolYear);
