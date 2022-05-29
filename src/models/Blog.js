const { Schema, model, Types } = require('mongoose');

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: { type: Types.ObjectId, required: true, ref: 'user' }, // user는 관계형
    // user는 User 모델의 21번 라인의 'user'와 일치해야한다
  },
  { timestamps: true } // 타임스탬프 추가하기
);

const Blog = model('blog', BlogSchema);

module.exports = { Blog };
