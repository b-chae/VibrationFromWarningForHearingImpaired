import sayHello from "../src/app"


describe('Test Start', function () {
    it('say Hello Should return HEllO', function (done) {
        if (sayHello() === 'HELLO') {
            done();
        }
    })
});