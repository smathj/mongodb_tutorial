const { Schema, model } = require('mongoose');

// 모델과 스키마를 만들거임

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: Number,
    email: String,
  },
  { timestamps: true } // 타임스탬프 추가하기
);

// 몽구스에 알려주기
// user라는 컬렉션에, 스키마가 이렇게 들어갈꺼야-
// 실제 컬렉션은 "users" 복수형태로 생성된다
const User = model('user', UserSchema);

module.exports = { User };
