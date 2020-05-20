import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {lighten, makeStyles, useTheme} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterList from '@material-ui/icons/FilterList'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {set} from 'date-fns'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {id: 'name', label: 'Name'},
  {id: 'date', label: 'Date'},
  {id: 'service', label: 'Service'},
  {id: 'feature', label: 'Feature'},
  {id: 'complexity', label: 'Complexity'},
  {id: 'platforms', label: 'Platforms'},
  {id: 'users', label: 'Users'},
  {id: 'total', label: 'Total'}
]

function EnhancedTableHead(props) {
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'select all desserts'}}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: '1 1 100%'
  },
  menu: {
    '&:hover': {
      backgroundColor: '#fff'
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#fff'
    }
  },
  totalFilter: {
    color: theme.palette.common.orange,
    fontSize: '2rem'
  }
}))

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles()
  const [undo, setUndo] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [openMenu, setOpenMenu] = React.useState(false)
  const {numSelected, rows, setRow, setSelected} = props
  const [alert, setAlert] = React.useState({
    open: false,
    backgroundColor: 'red',
    message: 'Row deleted'
  })
  const onDelete = () => {
    const allRows = [...rows] //  clone deep
    let selected = allRows.filter((el) => props.selected.includes(el.name)) //secilenleri gotur
    selected.map((opt) => (opt.search = false)) //secilenleri searchini false eleki gorsenmesinler gmaildeki kimi sonra undo ola bilsin
    setRow(allRows)

    setUndo(selected)
    setAlert({...alert, open: true})
    setSelected([])
  }
  const onUndo = () => {
    setAlert({...alert, open: false})
    setUndo([])

    const allRows = [...rows] //  clone deep
    const redo = [...undo]
    redo.map((und) => (und.search = true))

    Array.prototype.push.apply(allRows, ...redo) //Merging two arrays
    setRow(allRows)
  }
  const handleClickAnchor = (e) => {
    setAnchorEl(e.currentTarget)
    setOpenMenu(true)
  }
  const handleClose = (e) => {
    setAnchorEl(null)
    setOpenMenu(false)
  }
  const handleTotalFilter = (e) => {
    props.setSearch('')
    props.setTotalFilterPrice(e.target.value)
    if (e.target.value !== '') {
      var allRows = [...props.rows]
      allRows.map((row) =>
        eval(
          `${e.target.value}  ${
            props.totalFilter === '=' ? '===' : props.totalFilter === '>' ? '>=' : '<='
          } ${row.total.slice(0, -1)}`
        )
          ? (row.search = true)
          : (row.search = false)
      )
      props.setRow(allRows)
    } else {
      var allRows = [...props.rows]
      allRows.map((row) => (row.search = true))
      props.setRow(allRows)
    }
  }
  const handleTotalFilterOperator = (operator) => {
    if (props.filterPrice !== '') {
      var allRows = [...props.rows]
      allRows.map((row) =>
        eval(
          `${props.filterPrice}  ${
            operator === '=' ? '===' : operator === '>' ? '>=' : '<='
          } ${row.total.slice(0, -1)}`
        )
          ? (row.search = true)
          : (row.search = false)
      )
      props.setRow(allRows)
    }
  }
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
      style={{justifyContent: 'flex-end', paddingRight: '2rem'}}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <FilterList color="secondary" style={{fontSize: 50}} onClick={handleClickAnchor} />
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={onDelete}>
            <DeleteIcon color="primary" />
          </IconButton>
        </Tooltip>
      ) : null}
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{
          style: {backgroundColor: alert.backgroundColor}
        }}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            setAlert({...alert, open: false})
            const allRows = [...props.rows]
            const names = [...undo.map((n) => n.name)]
            let changed = allRows.filter((el) => !names.includes(el.name)) //secilenlerden ferqli olanlar qalsin
            props.setRow(changed)
          }
        }}
        action={
          <Button onClick={onUndo} style={{color: 'white'}}>
            Undo
          </Button>
        }
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        elevation={0}
        // style={{zIndex: 1302}}
        keepMounted
      >
        <MenuItem classes={{root: classes.menu}}>
          <TextField
            placeholder="Enter a price to filter"
            type="number"
            onChange={handleTotalFilter}
            value={props.filterPrice}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className={classes.totalFilter} style={{fontSize: '1.5rem'}}>
                    $
                  </span>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    props.setTotalFilter(
                      props.totalFilter === '>' ? '<' : props.totalFilter === '<' ? '=' : '>'
                    )
                    handleTotalFilterOperator(
                      props.totalFilter === '>' ? '<' : props.totalFilter === '<' ? '=' : '>'
                    )
                  }}
                >
                  <span className={classes.totalFilter}>{props.totalFilter}</span>
                </InputAdornment>
              )
            }}
          />
        </MenuItem>
      </Menu>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  chip: {
    backgroundColor: theme.palette.common.blue,
    color: '#fff',
    marginRight: '2rem'
  }
}))

export default function EnhancedTable(props) {
  const classes = useStyles()
  const theme = useTheme()
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'))

  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('name')
  const [selected, setSelected] = React.useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [filterPrice, setTotalFilterPrice] = React.useState('')
  const [totalFilter, setTotalFilter] = React.useState('>')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.rows.filter((el) => el.search).map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    props.setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    props.setPage(0)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const onSwitchData = () => {
    const {switchesAndroid, switchesWebsite, switchesIos, switchesCustom} = props
    const website = props.rows.filter((el) => (switchesWebsite ? el.service === 'Website' : null))
    const android = props.rows.filter((el) =>
      switchesAndroid ? el.platforms.includes('Android') : null
    )
    const ios = props.rows.filter((el) => (switchesIos ? el.platforms.includes('Ios') : null))
    const software = props.rows.filter((el) =>
      switchesCustom ? el.service === 'Custom Software' : null
    )
    if (!switchesAndroid && !switchesWebsite && !switchesIos && !switchesCustom) {
      return props.rows
    } else {
      const newRow = android.concat(ios.filter((el) => android.indexOf(el) < 0)) //android arrayi ne elave ele hansiki eyni olanlari sayma
      const newRow2 = newRow.concat(software.filter((el) => newRow.indexOf(el) < 0))
      const newRow3 = newRow2.concat(website.filter((el) => newRow2.indexOf(el) < 0))

      return newRow3
    }
  }
  const onPriceFilter = (switchData) => {
    if (filterPrice !== '') {
      const allRows = [...switchData]
      allRows.map((row) =>
        eval(
          `${filterPrice}  ${
            totalFilter === '=' ? '===' : totalFilter === '>' ? '>=' : '<='
          } ${row.total.slice(0, -1)}`
        )
          ? row.search === false
            ? null
            : (row.search = true)
          : (row.search = false)
      )
      return allRows
    } else {
      return switchData
    }
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
          rows={props.rows}
          setRow={props.setRow}
          filterPrice={filterPrice}
          setTotalFilterPrice={setTotalFilterPrice}
          totalFilter={totalFilter}
          setTotalFilter={setTotalFilter}
          setSearch={props.setSearch}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.rows.length}
            />
            <TableBody>
              {stableSort(
                onPriceFilter(onSwitchData()).filter((row) => row.search),
                getComparator(order, orderBy)
              )
                .slice(props.page * rowsPerPage, props.page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{'aria-labelledby': labelId}}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        align="center"
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                      <TableCell align="center">{row.service}</TableCell>
                      <TableCell align="center" style={{maxWidth: matchesMD ? 'initial' : '8rem'}}>
                        {row.feature}
                      </TableCell>
                      <TableCell align="center">{row.complexity}</TableCell>
                      <TableCell align="center">{row.platforms}</TableCell>
                      <TableCell align="center">{row.users}</TableCell>
                      <TableCell align="center">{row.total}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={onPriceFilter(onSwitchData()).filter((el) => el.search).length}
          rowsPerPage={rowsPerPage}
          page={props.page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <Grid container justify="flex-end">
          <Grid item>
            {filterPrice !== '' ? (
              <Chip
                className={classes.chip}
                onDelete={() => {
                  setTotalFilterPrice('')
                  const allRows = [...props.rows]
                  allRows.map((el) => (el.search = true))
                  props.setRow(allRows)
                }}
                label={
                  totalFilter === '>'
                    ? `Less than or less equal to ${filterPrice}$`
                    : totalFilter === '<'
                    ? `Greater than or greater equal to ${filterPrice}$`
                    : `Equal to ${filterPrice}$`
                }
              />
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
