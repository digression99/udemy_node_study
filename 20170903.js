/*

node, javascript는 v8 엔진 아래에서 돌아간다.
기계어로 바로 변환된다.
V8는 C++로 작성되어있다.

terminal vs browser
browser에서는 window 객체에 모든 것이 담겨있다.
terminal에서는 global 객체에 모든 것이 담겨 있다.

browser에서는 document 객체에 페이지의 정보가 담겨 있다.
terminal에서는 process 객체에 정보가 담겨 있다.

process.exit(0); -> 노드를 종료한다.

----------------------------------

두번째 문장 nodejs uses an event-driven, non-blocking i/o model that makes it lightweight and efficient.

non-blocking i/o -> 데이터베이스 일수도 있고, http 일수도 있다. 아무리 많은 유저라도
모든 일을 안막히고 할 수 있게 된다.
-> 데이터베이스에서 뭔가를 가져올 동안 아무것도 못하고 기다리는 게 아니라,
그 중에 다른 일을 할 수 있게 하는 것. -> kicking off an event. -> event loop에 들어감.
다되면 callback이 호출.

single-threaded -> multi-threaded 에 비해 그렇게 느린 것도 아니다.

세번째 문장 nodejs package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
-> cherry on the top.
-> npmjs.com
*/

const fs = require('fs'); // built-in modules.
const os = require('os');
const notes = require('./notes');
const _ = require('lodash');

var user = os.userInfo();
//console.log(user);

let res = notes.addNote();
//console.log(res);

//console.log(notes.add(9, -2));

// make a file.
// fs.appendFile('greetings.txt', 'hello fucking world.', function(err) {
//     console.log(err);
// });

// fs.appendFile('greetings.txt', `\nHello, ${user.username} ! You are  ${ notes.age }.`, function(err) {
//     console.log(err);
// });

//////////////////////////// 20170903

// lodash test
//console.log(_.isString(true));
//console.log(_.isString("hello"));
var arr = [2, 1, 2, 3, 1, 5, 7, 8, 1, 7];
var arr2 = ['Andrew', 1, 'Kim', 2, 1, 'Andrew'];

// uniq -> 모든 중복을 제거
console.log(_.uniq(arr));
console.log(_.uniq(arr2));
console.log("원래 배열");
console.log(arr);
console.log(arr2);
console.log("Nodemon!");













