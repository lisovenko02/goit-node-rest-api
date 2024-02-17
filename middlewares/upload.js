import multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
    destination: tempDir,
});

const upload = multer({
     storage: multerConfig
});

export default upload;
