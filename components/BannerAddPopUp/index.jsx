import { useState, useContext, useRef } from 'react';
import {ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/firebase';
import style from './style.module.scss';
import { popUpsContext } from '../../context/popUpsContext';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material'


const BannerAddPopUp = ({ closeIcon, defaultBanner }) => {
  const { popUps, setPopUps } = useContext(popUpsContext);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerLink, setBannerLink] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const inputFileRef = useRef(null);

  const handleAddLink = () => {
    inputFileRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const currentDate = new Date().getTime();

    // Create a storage reference
    const storageRef = ref(storage, `files/banners/${currentDate}_${file?.name}`);

    // Upload the file to Firebase storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for upload progress and completion
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress updates if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        // Handle errors during upload
        console.error('Error uploading image:', error);
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Image download URL:', downloadURL);
          setSelectedImage(downloadURL);
          // Do something with the download URL (e.g., save it to state or send it to the server)
        });
      }
    );
  };

  const handleAddBanner = async () => {
    setIsLoading(true);
    if (selectedImage === null) {
      toast.error('Selecione uma imagem!');
      setIsLoading(false);
      return;
    }
    const data = {
      link: bannerLink,
      imageUrl: selectedImage
    };
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/banners/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        // O POST foi bem-sucedido
        toast.success('Banner adicionado com sucesso!');
      setIsLoading(false);
      selectedImage(null);
      } else {
        // O POST falhou
        toast.error('Falha ao adicionar o banner.');
      setIsLoading(false);

      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleExit = () => {
    setPopUps((prev) => ({ ...prev, bannerAdd: false }))
    setSelectedImage('/images/labels/defaultBanner.png');
  };
  return (
    <div className={popUps.bannerAdd ? style.popUpBackdrop : style.popUpDisabled}>
      <div className={style.popUp}>
        <div className={style.popUpHeader}>
          <h2>Novo Banner</h2>
          <button onClick={() => handleExit()}>
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>
        <div className={style.popUpBody}>
          <input type="file" style={{ display: 'none' }} ref={inputFileRef} onChange={handleImageUpload} />
          <img src={selectedImage ? selectedImage : defaultBanner} onClick={handleAddLink} alt="Default Banner" />
          <input type="text" value={bannerLink} onChange={(e) => setBannerLink(e.target.value)} placeholder="Link" />
        </div>
        <button onClick={handleAddBanner} className={style.addBannerBtn}>
          {isLoading && <CircularProgress size={20} color='inherit'/> }
          {!isLoading && 'Adicionar'}


        </button>
      </div>
    </div>
  );
};

export default BannerAddPopUp;
