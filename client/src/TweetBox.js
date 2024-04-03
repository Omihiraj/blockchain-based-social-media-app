import React, { useState, useEffect } from "react";
import "./TweetBox.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import { Button } from "@material-ui/core";
import axios from 'axios';
import { TwitterContractAddress } from './config.js';
import { ethers } from 'ethers';
import Twitter from './utils/TwitterContract.json'

import { db, storage } from './services/firebase';
import { getDownloadURL, ref as storageRef, uploadBytes, } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import uploadIcon from './assets/upload.jpg';
import { ThreeDots } from 'react-loader-spinner'

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [avatarOptions, setAvatarOptions] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const uniqueId = uuidv4();


  useEffect(() => {
    if (uploadedImg != null) {
      addTweet(); // Invoke a method after count exceeds 5
    }
  }, [uploadedImg]); // Only re-run the effect if count changes

  const onFileSelect = (event) => {
    const file = event.target.files[0];
    if (file == null) return null;
    const isValid = validateFileType(file);

    if (isValid) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));


    } else {
      // Handle invalid file type (e.g., display error message)
      console.error('Invalid file type. Please select an image.');
    }
  };

  const uploadImageAndSendTweet = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const imgRef = storageRef(storage, `files/${uniqueId}`);
    uploadBytes(imgRef, selectedFile)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log("Encoded URL");
            console.log(btoa(url));
            //console.log(atob(btoa(url)));
            setUploadedImg(btoa(url));
            console.log(uploadedImg);

            //addTweet();

            setTweetMessage("");
            setTweetImage("");
            setUploadedImg(null);
            setPreviewURL(null);
            setSelectedFile(null);

          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }



  const validateFileType = (file) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const extension = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(extension);
  };



  const addTweet = async () => {
    let tweet = {
      'tweetText': tweetMessage,
      'imgPath': uploadedImg,
      'isDeleted': false
    };

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        )

        let twitterTx = await TwitterContract.addTweet(tweet.tweetText, tweet.imgPath, tweet.isDeleted);
        console.log('Transaction confirmed!');
        setIsLoading(false);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  }

  // const sendTweet = (e) => {
  //   e.preventDefault();

  //   addTweet();

  //   setTweetMessage("");
  //   setTweetImage("");
  // };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...avatarOptions}
          />
          <div>
            <input
              onChange={(e) => setTweetMessage(e.target.value)}
              value={tweetMessage}
              placeholder="What's happening?"
              type="text"
              style={{ width: '500px', padding: '10px', border: 'none', outline: 'none', fontSize: '18px', fontFamily: 'sans-serif' }}
            />
            <br />
            {previewURL && (
              <img src={previewURL} alt="Selected Image" style={{ width: 500, }} />


            )}
            <br />
            {previewURL == null ? <>

              {isLoading && <div style={{ marginLeft: '20px' }}><ThreeDots
                visible={true}
                height="50"
                width="50"
                color="#000000"
                radius="5"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              /></div>}

            </> : <></>}

            <div >
              <input
                type="file"
                id="fileInput"
                name="myFile"
                accept=".jpg,.png,.pdf" // Adjust accepted file types as needed
                style={{ display: 'none' }}
                onChange={onFileSelect}
              />
              <label htmlFor="fileInput">
                <img src={uploadIcon} style={{ width: '70px', height: '70px', cursor: 'pointer' }}></img>

                {selectedFile && <span>({selectedFile.name})</span>}
              </label>
            </div>

          </div>

        </div>






        <Button
          onClick={uploadImageAndSendTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
      </form>
    </div>
  );
}

export default TweetBox;
