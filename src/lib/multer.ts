import multer from 'multer';
import path from 'path';
import os from 'os';

const upload = multer({
  dest: path.join(os.tmpdir()),
});

export default upload;
