const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },

    // v1.
    user: { type: ObjectId, required: true, ref: 'user' },
    // v2. userFullName 추가
    userFullName: { type: String, required: true },
    blog: { type: ObjectId, required: true, ref: 'blog' },
  },
  { timestamps: true } // 타임스탬프 추가하기
);

const Comment = model('comment', CommentSchema);

module.exports = { Comment, CommentSchema };
