// models/Todo.js

import mongoose from 'mongoose';

const TodoSchema =
  new mongoose.Schema(

    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        default: '',
        maxlength: 1000,
      },

      category: {
        type: String,
        required: true,

        enum: [
          'work',
          'meet',
          'personal',
          'home',
        ],
      },

      date: {
        type: String,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },

      isCompleted: {
        type: Boolean,
        default: false,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

        index: true,
      },
    },

    {
      timestamps: true,
    }

  );


// برای Calendar و List
TodoSchema.index({
  userId: 1,
  date: 1,
});


export default mongoose.models.Todo ||
  mongoose.model(
    'Todo',
    TodoSchema
  );