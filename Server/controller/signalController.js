import dotenv from 'dotenv';
// import multer from 'multer';
// import path from 'path';
import spawn from 'child_process';
import fs from 'fs';
import config from '../config.json'

dotenv.config();

function _python() {
    return new Promise((resolve, object) => {
        const pythonProcess = spawn.spawn('python3', [config.pythonPath, '--config=../ML/Keras-Project-Template/configs/wav_classify_config.json']);
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
	console.log(new Date());
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
        return res.sendStatus(400);
    }
}

export const soundPost = async (req, res) => {
    var dataToSend = "";
	console.log("before fs.writeFile");
    await fs.writeFile(config.fileName, req.rawBody, (err) => {
        if (err) return console.log(err);
    });
  console.log("after fs.writeFile");
    dataToSend = await _python();
	console.log("after await _python");
    var listed = [];
    listed = dataToSend.split('\n');
    console.log("dataToSend : ", listed);
    const color = (listed[9] === 'baby cry' ? 'B' : (listed[9] === 'siren'?'R':'NULL'));
    const vibrate = (color == 'NULL' ? 'OFF' : 'ON');

    /* user_define_code는 보통 1000번대로 세팅을 합니다.
    공식 http code와 일치하지 않는 번호를 선택해기 위해서예요.
    그리고, 장난이라도 코드에는 비속어를 써두지 않는게 좋습니다.
    나도 모르게 남아서 나중에 귀찮아지는 경우가 발생해요.
    
    그리고 string으로 메시지를 보내야 한다면
    _BLUE_ , _RED_ 등의 네이밍 규칙을 정해서 쓰면 좋아요.
    가독성을 높이거든요. */

    if(vibrate === 'OFF') return res.status(203).send("fuck");
	else if(color === 'B') return res.status(201).send("201ddd");
	else if(color === 'R') return res.status(202).send("202ddd");
	else {
		console.log("else");
		return res.status(500).send("220002");
	}
   /* res.send({
        color: color,
        vibrate: vibrate
    });*/
}
const task = []
// export const vibeLedGet = (req, res) => {
//     console.log("VIBELGET");
//     // const pythonProcess = spawn.spawn('python', ["C:/Users/KimJaeWon/Desktop/Project/VibrationFromWarningForHearingImpaired/ML/Keras-Project-Template/main.py"]);
    
//     var dataToSend;
    
    

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
