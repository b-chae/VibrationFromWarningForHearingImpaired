import express from 'express';
import { soundPost, vibeLedGet } from '../controller/signalController';

const signalRouter = express.Router();

signalRouter.get('/', vibeLedGet);
signalRouter.post('/', soundPost);

export default signalRouter;