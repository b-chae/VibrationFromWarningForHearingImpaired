import express from 'express';
import { soundPost, vibeLedGet, upload } from '../controller/signalController';

const signalRouter = express.Router();

signalRouter.get('/', vibeLedGet);
signalRouter.post('/', upload.single('mp3') , soundPost);

export default signalRouter;