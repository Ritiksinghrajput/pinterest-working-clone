const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect("mongodb://localhost:27017/Pintrest")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }], 
  },
  dp: {
    type: String, 
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: true,
  }
}, {
  timestamps: true 
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
