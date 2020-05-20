import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import AddIcon from '@material-ui/icons/Add'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns' // choose your lib
import {format} from 'date-fns' // choose your lib

import {makeStyles, useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {Button} from '@material-ui/core'
import {Hidden} from '@material-ui/core'
import EnhancedTable from '../src/ui/EnhancedTable'

function createData(name, date, service, feature, complexity, platforms, users, total, search) {
  return {name, date, service, feature, complexity, platforms, users, total, search}
}

const rows = [
  createData(
    'Zaur Aliyev',
    '19/10/11',
    'Website',
    'E-Commerce',
    'N/A',
    'N/A',
    'N/A',
    '1500$',
    true
  ),
  createData(
    'Elqdsk',
    '19/10/11',
    'E-Commerce',
    'GPS, Push Notifications, Users/Authentication, File Transfer',
    'Medium',
    'Android',
    '1-10',
    '1800$',
    true
  ),
  createData(
    'Stqobs',
    '20/01/11',
    'Custom Software',
    'Push Notifications,  File Transfer',
    'High',
    'Custom Software',
    '1-10',
    '500$',
    true
  ),
  createData(
    'Elqsk',
    '19/10/11',
    'E-Commerce',
    'GPS, Push Notifications, Users/Authentication, File Transfer',
    'Medium',
    'Ios Android',
    '1-10',
    '1800$',
    true
  ),
  createData(
    'Elak',
    '19/10/11',
    'Custom Software',
    'GPS, Push Notifications, Users/Authentication, File Transfer',
    'Medium',
    'Web Application',
    '1-10',
    '1800$',
    true
  ),
  createData(
    'Elo ',
    '19/10/11',
    'E-Commerce',
    'GPS, Push Notifications, Users/Authentication, File Transfer',
    'Medium',
    'Ios Website',
    '1-10',
    '1800$',
    true
  )
]
const platformOptions = ['Web', 'Ios', 'Android']
let featureOptions = [
  'Photo/Video',
  'GPS',
  'File Transfer',
  'user-Authentication',
  'Biometrics',
  'Push Notifications'
]
const websiteFeatureOptions = ['Photo/Video', 'user-Authentication', 'Biometrics']

const useStyles = makeStyles((theme) => ({
  service: {
    fontWeight: 300
  },
  users: {
    marginRight: 0
  },
  button: {
    backgroundColor: theme.palette.common.orange,
    color: 'white',
    borderRadius: 50,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light
    }
  }
}))

export default function Project() {
  const classes = useStyles()
  const theme = useTheme()
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'))
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'))

  const [switchesWebsite, setSwitchesWebsite] = React.useState(false)
  const [switchesAndroid, setSwitchesAndroid] = React.useState(false)
  const [switchesIos, setSwitchesIos] = React.useState(false)
  const [switchesCustom, setSwitchesCustom] = React.useState(false)
  const [row, setRow] = React.useState(rows)
  const [name, setName] = React.useState('')
  const [total, setTotal] = React.useState('')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedDate, handleDateChange] = React.useState(new Date())

  const [serviceRadio, setServiceRadio] = React.useState('')
  const [complexityRadio, setComplexityRadio] = React.useState('')
  const [usersRadio, setUsersRadio] = React.useState('')

  const [platforms, setPlatforms] = React.useState([])
  const [features, setFeatures] = React.useState([])

  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)

  const addNewRow = () => {
    let currentRows = [...row]
    let newRow = createData(
      name,
      format(selectedDate, 'MM/dd/yyyy'),
      serviceRadio,
      features.join(', '),
      serviceRadio === 'website' ? 'N/A' : complexityRadio,
      serviceRadio === 'website' ? 'N/A' : platforms.join(', '),
      serviceRadio === 'website' ? 'N/A' : usersRadio,
      total + ' $',
      true
    )

    let changedData = [...currentRows, newRow]
    setRow(changedData)
    setDialogOpen(false)
    setName('')
    setTotal('')
    handleDateChange(new Date())
    setServiceRadio('')
    setComplexityRadio('')
    setUsersRadio('')
    setPlatforms([])
    setFeatures([])
  }
  const handleSearch = (e) => {
    setSearch(e.target.value)
    /* boolen deyerlerden temizledim */
    let rowData = row.map((ro) => Object.values(ro).filter((opt) => opt !== false && opt !== true))
    /* baxiram eynilesen varmi */
    let matches = rowData.map((element) =>
      element.map((el) => el.toLowerCase().includes(e.target.value.toLowerCase()))
    )
    /* varsa,hemin indexe gore search deyerin true ele ki qalanlar false olsun  */
    let allRows = [...row]
    matches.map((row, index) => {
      row.includes(true) ? (allRows[index].search = true) : (allRows[index].search = false)
    })
    setRow(allRows)
    setPage(0)
  }
  const servicesOp = (
    <React.Fragment>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          Services
        </Typography>
      </Grid>
      <Grid item>
        <RadioGroup
          aria-label="service"
          name="service"
          value={serviceRadio}
          onChange={(e) => {
            setServiceRadio(e.target.value)
            setFeatures([])
          }}
        >
          <FormControlLabel
            value="website"
            control={<Radio />}
            label="Website"
            classes={{label: classes.service}}
          />
          <FormControlLabel
            value="mobile app"
            control={<Radio />}
            label="Mobile App"
            classes={{label: classes.service}}
          />
          <FormControlLabel
            value="custom software"
            control={<Radio />}
            label="Custom Software"
            classes={{label: classes.service}}
          />
        </RadioGroup>
      </Grid>
    </React.Fragment>
  )
  const complexityOp = (
    <React.Fragment>
      <Grid item>
        <Typography
          variant="h4"
          gutterBottom
          style={{color: serviceRadio === 'website' ? 'grey' : undefined}}
        >
          Complexity
        </Typography>
      </Grid>
      <Grid item>
        <RadioGroup
          aria-label="complexity"
          name="complexity"
          value={complexityRadio}
          onChange={(e) => setComplexityRadio(e.target.value)}
        >
          <FormControlLabel
            value="low"
            control={<Radio />}
            label="Low"
            classes={{label: classes.service}}
            disabled={serviceRadio === 'website'}
          />
          <FormControlLabel
            value="medium"
            control={<Radio />}
            label="Medium"
            classes={{label: classes.service}}
            disabled={serviceRadio === 'website'}
          />
          <FormControlLabel
            value="high"
            control={<Radio />}
            label="High"
            classes={{label: classes.service}}
            disabled={serviceRadio === 'website'}
          />
        </RadioGroup>
      </Grid>
    </React.Fragment>
  )
  const usersOp = (
    <React.Fragment>
      <Grid item>
        <Typography
          variant="h4"
          gutterBottom
          style={{color: serviceRadio === 'website' ? 'grey' : undefined}}
        >
          Users
        </Typography>
      </Grid>
      <Grid item>
        <RadioGroup
          aria-label="users"
          name="users"
          value={usersRadio}
          onChange={(e) => setUsersRadio(e.target.value)}
        >
          <FormControlLabel
            value="0-10"
            control={<Radio />}
            label="0-10"
            classes={{label: classes.service, root: classes.users}}
            disabled={serviceRadio === 'website'}
          />
          <FormControlLabel
            value="10-100"
            control={<Radio />}
            label="10-100"
            classes={{label: classes.service, root: classes.users}}
            disabled={serviceRadio === 'website'}
          />
          <FormControlLabel
            value="100+"
            control={<Radio />}
            label="100+"
            classes={{label: classes.service, root: classes.users}}
            disabled={serviceRadio === 'website'}
          />
        </RadioGroup>
      </Grid>
    </React.Fragment>
  )
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container direction="column" alignItems={matchesSM ? 'center' : undefined}>
        <Grid item style={{marginTop: '2rem', marginLeft: matchesSM ? 0 : '5rem'}}>
          <Typography variant="h1">Project</Typography>
        </Grid>
        <Grid item style={{marginTop: '1rem'}}>
          <TextField
            placeholder="Search project details or create a new entry."
            value={search}
            onChange={handleSearch}
            style={{width: matchesSM ? '20rem' : '35rem', marginLeft: matchesSM ? 0 : '5rem'}}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setDialogOpen(true)}
                  style={{cursor: 'pointer'}}
                >
                  <AddIcon color="primary" style={{fontSize: 30}} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item style={{marginTop: '2rem', marginLeft: matchesSM ? 0 : '5rem'}}>
          <FormGroup row>
            <Grid
              container
              direction={matchesSM ? 'column' : 'row'}
              justify={matchesSM ? 'center' : undefined}
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchesWebsite}
                      onChange={() => setSwitchesWebsite(!switchesWebsite)}
                      name="website"
                      color="primary"
                    />
                  }
                  label="Websites"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                  style={{marginRight: matchesSM ? 0 : '5rem'}}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchesIos}
                      onChange={() => setSwitchesIos(!switchesIos)}
                      name="ios"
                      color="primary"
                    />
                  }
                  label="Ios Apps"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                  style={{marginRight: matchesSM ? 0 : '5rem'}}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchesAndroid}
                      onChange={() => setSwitchesAndroid(!switchesAndroid)}
                      name="android"
                      color="primary"
                    />
                  }
                  label="Android Apps"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                  style={{marginRight: matchesSM ? 0 : '5rem'}}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchesCustom}
                      onChange={() => setSwitchesCustom(!switchesCustom)}
                      name="custom"
                      color="primary"
                    />
                  }
                  label="Custom Software"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Grid>
        <Grid
          item
          style={{marginTop: '4rem', marginBottom: matchesMD ? '20rem' : '25rem', maxWidth: '100%'}}
        >
          <EnhancedTable
            rows={row}
            setRow={setRow}
            page={page}
            setPage={setPage}
            switchesWebsite={switchesWebsite}
            switchesAndroid={switchesAndroid}
            switchesIos={switchesIos}
            switchesCustom={switchesCustom}
            setSearch={setSearch}
          />
        </Grid>
        <Dialog
          style={{zIndex: 1302}}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          fullScreen={matchesSM}
          maxWidth="md"
        >
          <Grid
            container
            justify="center"
            alignItems={matchesSM ? 'center' : undefined}
            direction={matchesSM ? 'column' : 'row'}
          >
            <Grid item>
              <Typography variant="h1" style={{marginTop: '1rem'}} gutterBottom>
                Add New Project
              </Typography>
            </Grid>
          </Grid>
          <DialogContent>
            <Grid container justify="space-between" direction={matchesSM ? 'column' : 'row'}>
              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  sm
                  alignItems={matchesSM ? 'center' : undefined}
                >
                  <Hidden mdUp>{servicesOp}</Hidden>
                  <Hidden mdUp>{complexityOp}</Hidden>
                  <Hidden mdUp>{usersOp}</Hidden>
                  <Grid item>
                    <TextField
                      label="Name"
                      id="name"
                      fullWidth={!matchesSM}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{width: matchesSM ? 250 : '12rem'}}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    style={{marginTop: matchesSM ? 50 : '5rem'}}
                    alignItems={matchesSM ? 'center' : undefined}
                  >
                    <Hidden smDown>{servicesOp}</Hidden>
                  </Grid>
                  <Grid item style={{marginTop: matchesSM ? 50 : '5rem'}}>
                    <Select
                      labelId="platforms"
                      id="platforms"
                      disabled={serviceRadio === 'website'}
                      multiple
                      value={platforms}
                      onChange={(e) => setPlatforms(e.target.value)}
                      displayEmpty
                      renderValue={platforms.length > 0 ? undefined : () => 'Platforms'}
                      style={{width: matchesSM ? 250 : '12rem'}}
                      MenuProps={{style: {zIndex: 1302}}}
                    >
                      {platformOptions.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  alignItems="center"
                  sm
                  style={{marginTop: '1rem'}}
                >
                  <Grid item style={{marginTop: matchesSM ? 80 : null}}>
                    <KeyboardDatePicker
                      value={selectedDate}
                      onChange={(newDate) => handleDateChange(newDate)}
                      format="MM/dd/yyyy"
                      style={{width: matchesSM ? 250 : '12rem'}}
                      DialogProps={{style: {zIndex: 1302}}}
                    />
                  </Grid>
                  <Grid item>
                    <Grid
                      item
                      container
                      direction="column"
                      style={{marginTop: matchesSM ? 50 : '5rem'}}
                    >
                      <Hidden smDown>{complexityOp}</Hidden>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  sm
                  alignItems={matchesSM ? 'center' : 'flex-end'}
                >
                  <Grid item style={{marginTop: matchesSM ? 50 : null}}>
                    <TextField
                      label="Total"
                      id="total"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      type="number"
                    />
                  </Grid>
                  <Grid item>
                    <Grid
                      item
                      container
                      direction="column"
                      style={{marginTop: matchesSM ? 50 : '5rem'}}
                    >
                      <Hidden smDown>{usersOp}</Hidden>
                    </Grid>
                  </Grid>
                  <Grid item style={{marginTop: '5rem'}}>
                    <Select
                      labelId="features"
                      id="features"
                      multiple
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      displayEmpty
                      renderValue={features.length > 0 ? undefined : () => 'Features'}
                      style={{width: matchesSM ? 250 : '12rem'}}
                      MenuProps={{style: {zIndex: 1302}}}
                    >
                      {serviceRadio === 'website'
                        ? websiteFeatureOptions.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))
                        : featureOptions.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container justify="center" style={{marginTop: '3rem'}}>
              <Grid item>
                <Button
                  color="primary"
                  style={{fontWeight: 300}}
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item style={{marginLeft: '1rem'}}>
                <Button
                  variant="contained"
                  onClick={addNewRow}
                  className={classes.button}
                  style={{fontWeight: 300}}
                  disabled={
                    serviceRadio === 'website'
                      ? name.length === 0 ||
                        total.length === 0 ||
                        features.length === 0 ||
                        features.length > 1
                      : name.length === 0 ||
                        total.length === 0 ||
                        features.length === 0 ||
                        platforms.length === 0 ||
                        usersRadio.length === 0 ||
                        complexityRadio.length === 0 ||
                        serviceRadio.length === 0
                  }
                >
                  Add Project +
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}
