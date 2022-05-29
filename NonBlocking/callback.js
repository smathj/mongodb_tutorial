// Non-Blocking IO 느껴보기
// CabllBack Pattern

const addSum = (a, b, callback) => {
  setTimeout(() => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      callback('a, b must be numbers');
    } else {
      callback(undefined, a + b);
    }
  }, 3000);
};

let callback = (error, sum) => {
  if (error) {
    console.log({ error });
  } else {
    console.log(sum);
  }
};

addSum(10, 20, callback);
