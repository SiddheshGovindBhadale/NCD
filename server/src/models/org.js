const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const orgSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  code:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }
})




const Organization = new mongoose.model("Organization" ,orgSchema );

module.exports = Organization;