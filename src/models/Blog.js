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

//! comments라는 가상 필드 추가
BlogSchema.virtual('comments', {
  ref: 'comment', // comment 도큐먼트을 참조
  localField: '_id', // 기본적으로 _id가 만들어지니까 (blog의 _id)
  foreignField: 'blog', // comment 도큐먼트의 blog가 포렌키역할 (pk는 comment's _id 겠지)
});

BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

const Blog = model('blog', BlogSchema);

module.exports = { Blog };
