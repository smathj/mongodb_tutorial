const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: 'user' },
    blog: { type: ObjectId, required: true, ref: 'blog' },
  },
  { timestamps: true } // 타임스탬프 추가하기
);

const Comment = model('comment', CommentSchema);

module.exports = { Comment };
