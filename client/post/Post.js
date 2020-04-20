import React, {Component} from 'react'
import auth from './../auth/auth-helper'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import FavoriteIcon from 'material-ui-icons/Favorite'
import FavoriteBorderIcon from 'material-ui-icons/FavoriteBorder'
import CommentIcon from 'material-ui-icons/Comment'
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {Link} from 'react-router-dom'
import {remove, like, unlike} from './api-post.js'
import Comments from './Comments'

import MapContainer from './MapComponent'

// import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
// import Geocode from "react-geocode";

// Geocode.setApiKey("YOUR_API_KEY");
// Geocode.setLanguage("en");
// Geocode.enableDebug();


// function codeAddress(location) {
//   var address = location;
//   console.log("Boom", address)
//   var loc;
//   Geocode.fromAddress(address).then(
//       response => {
//         // const { lat, lng } = response.results[0].geometry.location;
//         var myLoc = new Array();
//         myLoc[0] = response.results[0].geometry.location.lat;
//         myLoc[1] = response.results[0].geometry.location.lng;
//         // console.log(lat, lng);
//         loc = myLoc;
//         console.log("DATA", loc)
//         return loc;
//       },
//       error => {
//         console.error(error);
//       }
//     );
// }

const styles = theme => ({
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing.unit*10 + 100 ,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    height: '700px',
    paddingBottom: '50px'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit*2}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  text: {
    margin: theme.spacing.unit*2
  },
  location: {
    margin: theme.spacing.unit*2
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding:theme.spacing.unit
  },
  media: {
    height: 200
  },
  button: {
   margin: theme.spacing.unit,
  }
})

class Post extends Component {
  state = {
    like: false,
    likes: 0,
    comments: []
  }

  componentDidMount = () => {
    this.setState({like:this.checkLike(this.props.post.likes), likes: this.props.post.likes.length, comments: this.props.post.comments})
  }
  componentWillReceiveProps = (props) => {
    this.setState({like:this.checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
  }

  checkLike = (likes) => {
    const jwt = auth.isAuthenticated()
    let match = likes.indexOf(jwt.user._id) !== -1
    return match
  }

  like = () => {
    let callApi = this.state.like ? unlike : like
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.props.post._id).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({like: !this.state.like, likes: data.likes.length})
      }
    })
  }

  updateComments = (comments) => {
    this.setState({comments: comments})
  }

  deletePost = () => {
    const jwt = auth.isAuthenticated()
    remove({
      postId: this.props.post._id
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.props.onRemove(this.props.post)
      }
    })
  }
  render() {
    const {classes} = this.props
    return (
      <Card className={classes.card}>
        <CardHeader
            avatar={
              <Avatar src={'/api/users/photo/'+this.props.post.postedBy._id}/>
            }
            action={this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
              <IconButton onClick={this.deletePost}>
                <DeleteIcon />
              </IconButton>
            }
            title={<Link to={"/user/" + this.props.post.postedBy._id}>{this.props.post.postedBy.name}</Link>}
            subheader={(new Date(this.props.post.created)).toDateString()}
            className={classes.cardHeader}
          />
        
        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.text}>
            <center>{this.props.post.text}</center>
          </Typography>
          <Typography component="p" className={classes.location}>
            
             <center>Location: <a>{this.props.post.address + " " + this.props.post.city + " " + this.props.post.state} </a> </center>
          </Typography>
          {this.props.post.photo &&
            (<div className={classes.photo}>
              <img
                className={classes.media}
                src={'/api/posts/photo/'+this.props.post._id}
                />
            </div>)}
        </CardContent>
        <CardActions>
          { this.state.like
            ? <IconButton onClick={this.like} className={classes.button} aria-label="Like" color="secondary">
                <FavoriteIcon />
              </IconButton>
            : <IconButton onClick={this.like} className={classes.button} aria-label="Unlike" color="secondary">
                <FavoriteBorderIcon />
              </IconButton> } <span>{this.state.likes}</span>
              <IconButton className={classes.button} aria-label="Comment" color="secondary">
                <CommentIcon/>
              </IconButton> <span>{this.state.comments.length}</span>
        </CardActions>
        <Divider/>
        <Comments postId={this.props.post._id} comments={this.state.comments} updateComments={this.updateComments}/>
        <MapContainer address = {this.props.post.address + " " + this.props.post.city + " " + this.props.post.state } latitude = {this.props.lat} longitude = {this.props.lng} > </MapContainer>
      </Card>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default withStyles(styles)(Post)