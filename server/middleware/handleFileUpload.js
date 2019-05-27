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
    console.log(err.message);
    err instanceof multer.MulterError || err.message === 'Only images are allowed.'
      ? res.status(406).json(err.message)
      : res.status(500).json('Something went wrong');
    return;
  }

  if (!req.file) {
    res.status(404).json('Image not found');
  }

  try {
    // make sure the file is an image and the extension have not been changed
    const filePath = path.resolve(__dirname, `../../${req.file.path}`);
    const buffer = await readChunk(filePath, 0, fileType.minimumBytes);
    const fileTypeResult = fileType(buffer);
    if (!fileTypeResult || !fileType(buffer).mime.match(/image\/.*/)) {
      await unlink(filePath);
      res.status(406).json('Only images are allowed.');
      return;
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json('Something went wrong');
    return;
  }

  await User.updateOne(
    { _id: req.userId },
    { $set: { avatar: req.file.filename } },
  );

  res.json('Image uploaded successfully');
};
