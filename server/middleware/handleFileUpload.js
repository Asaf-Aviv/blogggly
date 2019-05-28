const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const path = require('path');
const multer = require('multer');
const { promisify } = require('util');
const User = require('../models/User');

const unlink = promisify(fs.unlink);

module.exports = async (req, res, err) => {
  if (err) {
    console.error(err.message);
    err instanceof multer.MulterError || err.message === 'Only images are allowed.'
      ? res.status(406).json({ error: err })
      : res.status(500).json({ error: { message: 'Something went wrong' } });
    return;
  }

  if (!req.file) {
    res.status(404).json({ error: { message: 'Image not found' } });
  }

  try {
    // make sure the file is an image and the extension have not been changed
    const filePath = path.resolve(__dirname, `../../${req.file.path}`);
    const buffer = await readChunk(filePath, 0, fileType.minimumBytes);
    const fileTypeResult = fileType(buffer);
    if (!fileTypeResult || !fileType(buffer).mime.match(/image\/.*/)) {
      res.status(406).json({ error: { message: 'Only images are allowed.' } });
      unlink(filePath);
      return;
    }
  } catch (e) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Something went wrong' } });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { avatar: req.file.filename } },
    { select: 'avatar' },
  );

  try {
    unlink(path.resolve(__dirname, `../uploads/avatar/${user.avatar}`));
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.error(e);
  }

  res.json({ avatar: req.file.filename });
};
