import dotenv from 'dotenv';
// import multer from 'multer';
// import path from 'path';
import spawn from 'child_process';
import fs from 'fs';
import async from 'async';

dotenv.config();

// export const upload = multer({
//     dest: path.resolve(__dirname, 'uploads/')
// });
var index = 0;
const fileName = 'myfile.wav';
const pythonPath = "C:/Users/KimJaeWon/Desktop/Project/VibrationFromWarningForHearingImpaired/pyt.py"

function _python() {
    return new Promise((resolve, object) => {
        const pythonProcess = spawn.spawn('python', [pythonPath, fileName]);
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

    await fs.writeFile(fileName, req.rawBody, (err) => {
        if (err) return console.log(err);
    });
    
    dataToSend = await _python();
    var listed = [];
    listed = dataToSend.split('\r\n');
    
    console.log(listed);
    console.log(typeof (dataToSend));
    console.log("dataToSend : ", listed);
    res.send({
        listed
    });

}
const task = []
// export const vibeLedGet = (req, res) => {
//     console.log("VIBELGET");
//     // const pythonProcess = spawn.spawn('python', ["C:/Users/KimJaeWon/Desktop/Project/VibrationFromWarningForHearingImpaired/ML/Keras-Project-Template/main.py"]);
    
//     var dataToSend;
    
    

//     // var ID = req.query.ID;
//     // var PW = req.query.PW;
//     // if (ID === process.env.ID && PW === process.env.PASSWORD) {
//     //     var color = req.query.color;

//     //     vibrate();
//     //     led(color);
//     // }
// }

