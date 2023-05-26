const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const pangolinSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Guerrier', 'Alchimiste', 'Sorcier', 'Espion', 'Enchanteur'],
    required: true,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pangolin',
  }],
});

pangolinSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Pangolin = mongoose.model('Pangolin', pangolinSchema);

module.exports = Pangolin;
