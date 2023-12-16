const mongoose = require('mongoose');
const User = require('./models/User');
const StatusUpdate = require('./models/StatusUpdate');

mongoose.connect('mongodb+srv://ziyuema:981022mzy@zmwebdev.adnhpnf.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }); // 替换为您的数据库连接字符串

async function checkData() {
  try {
    const users = await User.find();
    console.log('Users:', users);

    const statusUpdates = await StatusUpdate.find().populate('user');
    console.log('Status Updates:', statusUpdates);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkData();
