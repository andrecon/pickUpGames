import React, {Component} from 'react'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {create} from './api-post.js'
import auth from './../auth/auth-helper'
import IconButton from 'material-ui/IconButton'
import PhotoCamera from 'material-ui-icons/PhotoCamera'

// import 'date-fns';
// import Grid from '@material-ui/core/Grid';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';


const styles = theme => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing.unit*3}px 0px 1px`
  },
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing.unit*3,
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none'
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
    width: '90%'
  },
  addressField: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
    width: '43%'
  },
  submit: {
    margin: theme.spacing.unit * 2
  },
  filename:{
    verticalAlign: 'super'
  },
  span: {
    whiteSpace: 'pre-line'
  }
})

// const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

// const handleDateChange = (date) => {
//   setSelectedDate(date);
// };

class NewPost extends Component {
  state = {
    text: '',
    photo: '',
    error: '',
    lat: '',
    lng: '',
    user: {}
  }

  componentDidMount = () => {
    this.postData = new FormData()
    this.setState({user: auth.isAuthenticated().user})
  }
  clickPost = () => {
    const jwt = auth.isAuthenticated()
    create({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.postData).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({text:'', address:'', city:'', state:'', postal_code:'', date:'', photo: '', title:'' })
        this.props.addUpdate(data)
      }
    })
  }
  handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    this.postData.set(name, value)
    this.setState({ [name]: value })
  }
  
  render() {
    const {classes} = this.props
    return (<div className={classes.root}>
      <Card className={classes.card}>
      <CardHeader
            avatar={
              <Avatar src={'/api/users/photo/'+this.state.user._id}/>
            }
            title={this.state.user.name}
            className={classes.cardHeader}
          />
      <CardContent className={classes.cardContent}>
        <TextField
            placeholder="Title"
            multiline
            rows="3"
            value={this.state.title}
            onChange={this.handleChange('title')}
            className={classes.textField}
            margin="normal"
        />
        <TextField
            placeholder="Describe Activity Session ..."
            multiline
            rows="3"
            value={this.state.text}
            onChange={this.handleChange('text')}
            className={classes.textField}
            margin="normal"
        />
        <TextField
            placeholder="Address"
            multiline
            rows="1"
            value={this.state.address}
            onChange={this.handleChange('address')}
            className={classes.addressField}
            margin="normal"
        />
        <TextField
            placeholder="City"
            multiline
            rows="1"
            value={this.state.city}
            onChange={this.handleChange('city')}
            className={classes.addressField}
            margin="normal"
        />
        <TextField
            placeholder="State"
            multiline
            rows="1"
            value={this.state.state}
            onChange={this.handleChange('state')}
            className={classes.addressField}
            margin="normal"
        />
        <TextField
            placeholder="Zip Code"
            multiline
            rows="1"
            value={this.state.postal_code}
            onChange={this.handleChange('postal_code')}
            className={classes.addressField}
            margin="normal"
        />
        <TextField
            placeholder="MM/DD/YYYY"
            multiline
            rows="1"
            value={this.state.date}
            onChange={this.handleChange('date')}
            className={classes.addressField}
            margin="normal"
        />
        {/* <TextField
          id="time"
          label="Alarm clock"
          type="time"
          defaultValue="07:30"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
           }}
        /> */}
        <input accept="image/*" onChange={this.handleChange('photo')} className={classes.input} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file">
          <IconButton color="secondary" className={classes.photoButton} component="span">
            <PhotoCamera />
          </IconButton>
        </label> <span className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span>
        { this.state.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}
            </Typography>)
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="raised" disabled={this.state.text === ''} onClick={this.clickPost} className={classes.submit}>POST</Button>
      </CardActions>
    </Card>
  </div>)
  }
}

NewPost.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
}

export default withStyles(styles)(NewPost)