import request from 'supertest';
import { expect } from 'chai';
import should from 'should';
import formData from 'form-data';
import fs from 'fs';
import app from '../src/app';

/*
1. Sound Sensor -> POST ->  DB
2. Server -> Signal -> Vibrator, LED
*/

// MP3 Post Test (Form-Data)
describe('MP3 form-data POST /', function () {
    it('should return 200 status code ', function (done) {
        request(app)
            .post('/')
            .field("Content-Type", "multipart/form-data")
            .field("name", "Vibration")
            .attach('mp3', './res/Test.mp3')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
            })
        done();
    })
});