const mongoose = require("mongoose");

const schema = mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
 
});

const model = mongoose.models.User || mongoose.model("User", schema);

export default model;
