const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }
})


// bcrypt password
userSchema.pre("save" , async function(next){
   if(this.isModified("password")){
       this.password = await bcrypt.hash(this.password , 10)
       //this.conPassword = undefined
   }
   
   next()
   
})

const User = new mongoose.model("User" ,userSchema );

module.exports = User;