//
// nodejs debug mode -> node inspect (appname) 이렇게 치면 커맨드 라인 디버거가 활성화된다
// n : next
// c : complete the program.
// repl : read evaluate print loop -> just type repl
// -> 각 객체의 값들을 직접 쳐볼 수 있다.

// node --inspect-brk debugging_test.js -> 주소가 주어지고 크롬에서 할 수 있게 된다.
// 크롬에서 chrome://inspect로 들어간다.
// 거기서 inspect누르면 된다. -> 라즈베리파이에서 유용할 듯.
// console은 repl과 비슷하다

let person = {
    name : "Andrew"
};

person.age = 30;

debugger; // node step here in debugging mode. if I type c, then debugger stops here.

person.name = "Mike";

console.log(person);