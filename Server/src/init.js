import dotenv from 'dotenv';
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
    console.log(`✅ PORT:${PORT} Running`);

app.listen(PORT, handleListening);

//꿈같은 삶 완벽한 인생
