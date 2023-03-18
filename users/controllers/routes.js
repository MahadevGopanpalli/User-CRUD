const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.json({mssg:'User with this phone number already exists',data:{},status:1});
    }

    // Create a new user document in the MongoDB database using Mongoose
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone
    });
    let data = await newUser.save();

    return res.json({mssg:'User registered successfully',data:data,status:0});
  } catch (error) {
    console.error(error);
    return res.json({mssg:'Internal server error',data:{},status:1});
  }
});


router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.find({_id:req.params.id,isDeleted: false});

    // If user not found, return 404 response
    if (!user||user.length<1) {
      return res.json({mssg:'User not found',data:{},status:1});
    }

    return res.json({mssg:'User fetched successfully',data:user,status:0});
  } catch (error) {
    console.error(error);
    return res.json({mssg:'Internal server error',data:{},status:1});
  }
});


router.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = await User.findOneAndUpdate({_id:req.params.id,isDeleted: false,phone:req.body.phone},{
      firstName,
      lastName,
      email,
    }, { new: true });

    // If user not found, return 404 response
    if (!user) {
      return res.json({mssg:'User not found',data:{},status:1});
    }
    return res.json({mssg:'User updated successfully',data:user,status:0});

  } catch (error) {
    console.error(error);
    return res.json({mssg:'Internal server error',data:{},status:1});
  }
});



router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    }, { new: true });

    // If user not found, return 404 response
    if (!user) {
      return res.json({mssg:'User not found',data:{},status:1});
    }

    return res.json({mssg:'User deleted successfully',data:user,status:0});
  } catch (error) {
    console.error(error);
    return res.json({mssg:'Internal server error',data:{},status:1});
  }
});


router.post('/fetchByFilter', async (req, res) => {
  try {
    const { filters } = req.body;
    const query = {};

    // Add filters based on request body
    if (filters.firstName) {
      query.firstName = { $regex: new RegExp(filters.firstName, 'i') };
    }

    if (filters.lastName) {
      query.lastName = { $regex: new RegExp(filters.lastName, 'i') };
    }

    if (filters.email) {
      query.email = { $regex: new RegExp(filters.email, 'i') };
    }

    if (filters.phone) {
      query.phone = { $regex: new RegExp(filters.phone, 'i') };
    }

    query.isDeleted = false;
    const users = await User.find(query);

    return res.json({mssg:'User Fetched successfully',data:users,status:0});

  } catch (error) {
    console.error(error);
    return res.json({mssg:'Internal server error',data:[],status:1});
  }
});

module.exports = router;