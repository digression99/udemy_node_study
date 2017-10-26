var square = x => x * x;
var mul = (x, y) => x * y;
var add = (x, y) => x + y;

console.log(square(10, 20));

var user = {
    name : "Andrew",
    sayHiAlt() { // 이 문법을 쓰는 게 낫다.
        console.log(arguments); // 이게 원하는 것.
        console.log(`Hi, I'm ${this.name}`)
    },
    sayHi : () =>
    {
        console.log(arguments); // global arguments
        console.log("hi")
    }
};

user.sayHi();

//user.sayHiAlt(1, 2, 3);