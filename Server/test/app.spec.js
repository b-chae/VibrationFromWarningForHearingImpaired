import request from 'supertest';
import { expect } from 'chai';

import sayHello from "../src/app"

/*
1. Sound Sensor -> POST ->  DB
2. Server -> Signal -> Vibrator, LED
*/

describe('Test Start', function () {
    it('say Hello Should return HEllO', function (done) {
        if (sayHello() === 'HELLO') {
            done();
        }
    })
});