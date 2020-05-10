import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import spawn from 'child_process';

dotenv.config();

export const upload = multer({ dest: path.resolve(__dirname, 'uploads/')});


function vibrate() {
    console.log('vibrate');
};

function led(color) {
    console.log(`LED : ${color}`);
};


export const soundPost = (req, res) => {
    console.log(req.file);

    // const pythonProcess = spawn.spawn('python', ["../../ML/Keras-Project-Template/main.py"]);
    
}

export const vibeLedGet = (req, res) => {
    console.log("VIBELGET");
    const pythonProcess = spawn.spawn('python', ["C:/Users/KimJaeWon/Desktop/Project/VibrationFromWarningForHearingImpaired/ML/Keras-Project-Template/main.py"]);
    // const pythonProcess = spawn.spawn('python', ["C:/Users/KimJaeWon/Desktop/Project/VibrationFromWarningForHearingImpaired/pyt.py"]);
    var dataToSend;
    
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        dataToSend = data.toString();
    });

    pythonProcess.on('close', (code) => {
        console.log(`${code} 464646464`);
        res.send(dataToSend);
    })

    // var ID = req.query.ID;
    // var PW = req.query.PW;
    // if (ID === process.env.ID && PW === process.env.PASSWORD) {
    //     var color = req.query.color;

    //     vibrate();
    //     led(color);
    // }
}