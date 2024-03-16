import React, { useState } from "react";

import Navigate from "components/Navbar";

import { ChooseAsset } from "components/ChooseAsset_normalGoal";
import { FormGoal } from "components/formNormalGoal_normalGoal";

import "./normalGoal.css";

export const NormalGoal = () => {
  const [showChooseAsset, setShowChooseAsset] = useState(false);
  const [sharedData, setSharedData] = useState({});

  const handleData = (data) => {
    console.log("normalGoal: ", sharedData);
    setSharedData(data);
    setShowChooseAsset(true);
  };

  return (
    <React.Fragment>
      <Navigate />
      {!showChooseAsset ? (
        <FormGoal
          setShowChooseAsset={setShowChooseAsset}
          sendData={handleData}
        />
      ) : (
        <ChooseAsset data={sharedData} />
      )}
    </React.Fragment>
  );
};
