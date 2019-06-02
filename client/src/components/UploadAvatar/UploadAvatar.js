import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import ReactCrop from 'react-image-crop';
import Alert from 'react-s-alert';
import { UserContext } from '../../context';
import UserAvatar from '../UserAvatar';
import 'react-image-crop/dist/ReactCrop.css';
import './UploadAvatar.sass';
import Button from '../Button';

const UploadAvatar = () => {
  const [originalFile, setOriginalFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [crop, setCrop] = useState({
    width: 200,
    x: 0,
    y: 0,
  });

  const fileInputRef = useRef();
  const imageRef = useRef();

  const { loggedUser, setLoggedUser } = useContext(UserContext);

  useEffect(() => {
    setCroppedImageUrl('');
    setCroppedImageBlob('');
    setCrop({
      width: 200,
      x: 0,
      y: 0,
    });
  }, [src]);

  const resetAll = () => {
    fileInputRef.current.value = '';
    setOriginalFile(null);
    setSrc(null);
    setCroppedImageUrl(null);
    setCroppedImageBlob(null);
    setCrop({
      width: 200,
      x: 0,
      y: 0,
    });
  };

  const toggleFileUpload = () => fileInputRef.current.click();

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length) {
      const imageFile = e.target.files[0];
      setOriginalFile(imageFile);
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(imageFile);
    }
  };

  const onImageLoaded = (image) => {
    imageRef.current = image;
  };

  const onCropChange = (updatedCrop) => {
    setCrop(updatedCrop);
  };

  const makeClientCrop = async (currentcrop) => {
    if (imageRef.current && crop.width && crop.height) {
      const currentCroppedImageUrl = await getCroppedImg(
        imageRef.current,
        currentcrop,
        'croppedAvatar.jpeg',
      );
      setCroppedImageUrl(currentCroppedImageUrl);
    }
  };

  const getCroppedImg = (image, currentcrop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = currentcrop.width;
    canvas.height = currentcrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      currentcrop.x * scaleX,
      currentcrop.y * scaleY,
      currentcrop.width * scaleX,
      currentcrop.height * scaleY,
      0,
      0,
      currentcrop.width,
      currentcrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        setCroppedImageBlob(blob);
        window.URL.revokeObjectURL(croppedImageUrl);
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/png');
    });
  };

  const upload = () => {
    const formData = new FormData();
    if (croppedImageBlob) {
      formData.append('avatar', croppedImageBlob);
    } else if (originalFile) {
      formData.append('avatar', originalFile);
    } else {
      return;
    }

    fetch('/upload', {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      body: formData,
    })
      .then(async (res) => {
        if (res.status === 200) {
          Alert.success('Image uploaded successfully');
          const { avatar } = await res.json();
          setLoggedUser((draft) => {
            draft.avatar = avatar;
          });
          resetAll();
          return;
        }
        const { error } = await res.json();
        Alert.error(error.message);
      });
  };

  return (
    <div>
      <div className="upload">
        <div className="upload__avatar" onClick={toggleFileUpload}>
          <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={onSelectFile} />
          <UserAvatar
            width={100}
            avatar={loggedUser.avatar}
            username={loggedUser.username}
          />
          <i className="fas fa-plus upload__btn" />
        </div>
      </div>
      {src && (
        <div className="upload__image-container">
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={onImageLoaded}
            onChange={onCropChange}
            onComplete={makeClientCrop}
          />
          <Button onClick={upload} text="Upload" />
          <Button onClick={resetAll} text="Cancel" />
        </div>
      )}
    </div>
  );
};

export default UploadAvatar;
