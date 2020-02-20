import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Button from 'material-ui/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter, Route} from 'react-router-dom'

import Img from 'react-image'
import BackgroundImage from './../assets/images/logo.png'
// import styled from 'styled-components';

var logoStyle = {
  display: "block",
  width: "25%",
  height: "25%",
  marginLeft: "auto",
  marginRight: "auto",
  paddingTop: "50px",
  paddingBottom: "50px",
};

var header = {
  alignItems: "center !important",
  position: "static"
}

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#DD7C51'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(({history}) => (
  <AppBar style={ header }>
    <Img className={'logo'} src={BackgroundImage} style={ logoStyle } />
    <Toolbar>
      <Typography type="title" color="inherit">
        PickUpGames
      </Typography>
      <Link to="/">
         <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon/>
        </IconButton>
      </Link>
      <Link to="/users">
        <Button style={isActive(history, "/users")}>Users</Button>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              auth.signout(() => history.push('/'))
            }}>Sign out</Button>
        </span>)
      }
    </Toolbar>
  </AppBar>
))

export default Menu
