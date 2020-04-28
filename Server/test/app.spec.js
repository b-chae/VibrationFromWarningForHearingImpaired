import request from 'supertest';
import { expect } from 'chai';
import should from 'should';

import app from '../src/app';

/*
1. Sound Sensor -> POST ->  DB
2. Server -> Signal -> Vibrator, LED
*/

describe('POST /', function () {
    it('should return 200 status code ', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                console.log(res);
        })
    })
});