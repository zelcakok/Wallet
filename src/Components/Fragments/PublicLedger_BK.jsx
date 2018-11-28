//ReactJS
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

//Material UI
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import Grid  from '@material-ui/core/Grid';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import ViewIcon from '@material-ui/icons/RemoveRedEye';

//Libraries
import moment from 'moment';

//Colors
import red from '@material-ui/core/colors/red';

let counter = 0;
function createData(blockAddr, type, payer, payee, datetime, amount) {
  counter += 1;
  return { id: counter, blockAddr, type, payer, payee, datetime, amount};
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'transType', numeric: false, label: 'Transaction' },
  { id: 'payer', numeric: false, label: 'Payer' },
  { id: 'payee', numeric: false,  label: 'Payee' },
  { id: 'datetime', numeric: false, label: 'Date time' },
  { id: 'amount', numeric: true,  label: 'Amount (HKD)' },
  { id: 'details', numeric: false,  label: 'Details' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    // minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class PublicLedger extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
      createData('2913809238402934', 'Pay', 'Zelca Kok', 'Sarah Hui', moment().format("DD/MM/YY hh:mm A"), 4.3),
    ],
    page: 0,
    rowsPerPage: 5,
    isDetailShowed: false
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClose = () => {
    this.setState({ isDetailShowed: false });
  };

  viewDetails=(blockAddr)=>{
    this.setState({isDetailShowed: true});
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    return (
                      <TableRow
                        tabIndex={-1}
                        key={n.id}
                      >
                        <TableCell component="th">
                          {n.type}
                        </TableCell>
                        <TableCell>{n.payer}</TableCell>
                        <TableCell>{n.payee}</TableCell>
                        <TableCell>{n.datetime}</TableCell>
                        <TableCell
                          style={{color: n.type==="Pay"? red[500] : ""}}
                          numeric>
                          {
                            n.type === "Pay" ?
                            "("+n.amount.toFixed(2)+")" : n.amount.toFixed(2)
                          }
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={()=>this.viewDetails(n.blockAddr)}>
                            <ViewIcon/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog open={this.state.isDetailShowed} onClose={this.handleClose} fullWidth>
          <DialogTitle id="simple-dialog-title">Block details</DialogTitle>
          <DialogContent>
            <div>
              <Grid container direction="column">
                <Grid item>
                  <TextField id="blockAddr" fullWidth
                             label="Block Address"
                             value={"31249390434"} disabled
                             margin="normal" variant="outlined"/>
                </Grid>
                <Grid item>
                  <TextField id="prevHash" fullWidth
                             label="Previous Block Hash"
                             value={"0x932523423k432lk4h3"} disabled
                             margin="normal" variant="outlined"/>
                </Grid>
                <Grid item>
                  <TextField id="blockHash" fullWidth
                             label="Current Block Hash"
                             value={"0x324lk23j32k4j34"} disabled
                             margin="normal" variant="outlined"/>
                </Grid>
                <Grid item>
                  <TextField id="nonce" fullWidth
                             label="Nonce"
                             value={"3434"} disabled
                             margin="normal" variant="outlined"/>
                </Grid>
                <Grid item>
                  <TextField id="difficulty" fullWidth
                             label="Difficulty"
                             value={"6"} disabled
                             margin="normal" variant="outlined"/>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

PublicLedger.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PublicLedger);
