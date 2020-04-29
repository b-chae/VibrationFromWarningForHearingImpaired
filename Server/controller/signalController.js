import dotenv from 'dotenv';

dotenv.config();

function vibrate() {
    console.log('vibrate');
};

function led(color) {
    console.log(`LED : ${color}`);
};


export const soundPost = (req, res) => {
    var ID = req.query.ID;
    var PW = req.query.PW;
    if (ID === process.env.ID && PW === process.env.PASSWORD) {
        return;
    }
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