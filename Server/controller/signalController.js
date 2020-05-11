import dotenv from 'dotenv';
// import multer from 'multer';
// import path from 'path';
import spawn from 'child_process';
import fs from 'fs';
import config from '../config.json'

dotenv.config();

function _python() {
    return new Promise((resolve, object) => {
        const pythonProcess = spawn.spawn('python', [config.pythonPath, config.fileName]);
        var dataToSend;
    
        pythonProcess.stdout.on('data', (data) => {
            console.log(data.toString());
            dataToSend = data.toString();
        });
    
        pythonProcess.on('close', (code) => {
            console.log(`${code}`);
            resolve(dataToSend);
        })
    });
        
}

export const middleUpload = (req, res, next) => {
    console.log("middleUpload");
    try {
        var data = new Buffer('');
        req.on('data', (chunk) => {
            data = Buffer.concat([data, chunk]);
        })
        req.on('end', () => {
            console.log("Data", data);
    
            req.rawBody = data;
            next();
        })
    } catch (error) {
        console.err(error);
        return res.setStatus(400);
    }
}

export const soundPost = async (req, res) => {
    var dataToSend = "";
    await fs.writeFile(config.fileName, req.rawBody, (err) => {
        if (err) return console.log(err);
    });

    dataToSend = await _python();
    var listed = [];
    listed = dataToSend.split('\r\n');

    console.log("dataToSend : ", listed);
    res.send({
        color: listed[1].color,
        vibrate: listed[2].vibrate
    });
}

export const vibeLedGet = (req, res) => {
    console.log("VIBELGET");
    return res.sendStatus(200);
    // const pythonProcess = spawn.spawn('python', ["C:/Users/KimJaeWon/Desktop/Project/VibrationFromWarningForHearingImpaired/ML/Keras-Project-Template/main.py"]);
    
    
    

    // var ID = req.query.ID;
    // var PW = req.query.PW;
    // if (ID === process.env.ID && PW === process.env.PASSWORD) {
    //     var color = req.query.color;

    //     vibrate();
    //     led(color);
    // }
}
