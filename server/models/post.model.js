import mongoose from 'mongoose'
import crypto from 'crypto'
const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: 'Name is required'
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  address: {
    type: String,
    required: 'Address is required'
  },
  city: {
    type: String,
    required: 'City is required'
  },
  state: {
    type: String,
    required: 'State is required'
  },
  postal_code: {
    type: String,
    required: 'Zip Code is required'
  },
  date: { type: Date, required: true },
  
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  comments: [{
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
  }],
  postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  created: {
    type: Date,
    default: Date.now
  },
  lat: {
    type: String,
  },
  lng: {
    type: String,
  }

})

export default mongoose.model('Post', PostSchema)