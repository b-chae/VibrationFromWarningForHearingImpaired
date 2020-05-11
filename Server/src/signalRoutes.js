import express from 'express';
import { soundPost, vibeLedGet, upload, middleUpload } from '../controller/signalController';

const signalRouter = express.Router();

signalRouter.get('/', vibeLedGet);
signalRouter.post('/', middleUpload , soundPost);
// signalRouter.post('/', soundPost);
// signalRouter.post('/', ,soundPost);

export default signalRouter;