import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

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
    res.sendStatus(200);
    /*
    var ID = req.query.ID;
    var PW = req.query.PW;
    if (ID === process.env.ID && PW === process.env.PASSWORD) {
        return;
    }*/
}

export const vibeLedGet = (req, res) => {
    var ID = req.query.ID;
    var PW = req.query.PW;
    if (ID === process.env.ID && PW === process.env.PASSWORD) {
        var color = req.query.color;

        vibrate();
        led(color);
    }
}