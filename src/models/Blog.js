const { Schema, model, Types } = require('mongoose');
const { CommentSchema } = require('./Comment');

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    // v2.
    user: {
      _id: {
        type: Types.ObjectId,
        required: true,
        ref: 'user',
      },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    // v2. 내장 nest
    comments: [CommentSchema], // 배열형태에-

    // user: { type: Types.ObjectId, required: true, ref: 'user' }, // user는 관계형
    // user는 User 모델의 21번 라인의 'user'와 일치해야한다

    // a1. Blog 스키마에 count 추가하기
    commentsCount: { type: Number, default: 0, require: true },
  },
  { timestamps: true } // 타임스탬프 추가하기
);

// index추가
BlogSchema.index({ 'user._id': 1, updatedAt: 1 }); // 복합키
// text index: 컬렉션당 1개만 만들 수 있다, 단 복합키로서 여러개만들 수 있고 이때에는 순서는 중요하지 않음
BlogSchema.index({ title: 'text', content: 'text' });

//BlogSchema.index({ 'user._id': 1, updatedAt: 1 },  { unique: true}); // 복합키, 유니크는 이렇게함

//! v1.comments라는 가상 필드 추가
/** 
BlogSchema.virtual('comments', {  // 가상 칼럼 comments 생성
  ref: 'comment', // comment 도큐먼트(모델 이름, 테이블)을 참조
  localField: '_id', // 기본적으로 _id가 만들어지니까 (blog의 _id)
  foreignField: 'blog', // comment 도큐먼트의 blog가 포렌키역할 (pk는 comment's _id 겠지)
});

BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });
*/
const Blog = model('blog', BlogSchema);

module.exports = { Blog };
