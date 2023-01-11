const { json } = require("body-parser");

const CLARIFAI_MODEL = "face-detection";

const API_URL = `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL}/outputs`;

const requestOptions = (url) => {
  const raw = JSON.stringify({
    user_app_id: {
      user_id: process.env.CLARIFAI_USER_ID,
      app_id: process.env.CLARIFAI_APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url,
          },
        },
      },
    ],
  });

  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + process.env.CLARIFAI_PAT,
    },
    body: raw,
  };
};

const clarifaiFetch = async (input) => {
  const response = await fetch(API_URL, requestOptions(input));
  const data = await response.json();

  if (data.status.description === "Failure") {
    if (data.status.code === 10020) {
      return "invalid-link";
    } else {
      return "failure";
    }
  } else {
    const boxes = data.outputs[0].data.regions?.map((region) => {
      return region.region_info.bounding_box;
    });
    return boxes;
  }
};

const handleClarifai = (req, res) => {
    clarifaiFetch(req.body.url).then(data => {
        if(data === "invalid-link"){
          return res.status(400).json(data)
        }else if(data === "failure"){
          return res.status(400).json(data)
        } else{
          return res.json(data)
        }
    }).catch(err => res.status(400).json("clarifai-fail"))
};

module.exports = {handleClarifai}