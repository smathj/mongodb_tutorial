// Non-Blocking IO 느껴보기
// Promise

const addSum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== 'number' || typeof b !== 'number') {
        reject('a, b must be numbers');
      } else {
        // console.log({ sum: a + b });
        resolve(a + b);
      }
    }, 1000);
  });
};

// v1.
// addSum(10, 20)
//   //.then((sum) => console.log({ sum }))
//   .then((sum) => addSum(sum, 1))
//   .then((sum) => addSum(sum, 1))
//   .then((sum) => addSum(sum, 1))
//   .then((sum) => addSum(sum, 1))
//   .catch((err) => console.log({ error }));

// v2.
const totalSum = async () => {
  try {
    let sum = await addSum(10, 10);
    let sum2 = await addSum(sum, 10);
    console.log({ sum, sum2 });
  } catch (err) {
    console.log('a,b must be numbers');
    if (err) console.log({ err });
  }
};

totalSum();
