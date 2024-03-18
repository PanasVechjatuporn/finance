import React, { useState } from "react";

import Navigate from "components/Navbar";

import { ChooseAsset } from "components/ChooseAsset_normalGoal";
import { FormGoal } from "components/formNormalGoal_normalGoal";
import { RmfFactsheet } from "components/rmfGraph_normalGoal";
import { DepositFactsheet } from "components/depositGraph_normalGoal";

import "./normalGoal.css";

export const NormalGoal = () => {
  const [showFormGoal, setShowFormGoal] = useState(true);
  const [showChooseAsset, setShowChooseAsset] = useState(false);
  const [showGraph, setShowGraph] = useState("");
  const [dataBetweenComponents, setDataBetweenComponents] = useState({});

  const handleNextToChooseAsset = (data) => {
    setDataBetweenComponents(data);
    setShowFormGoal(false);
    setShowChooseAsset(true);
  };

  const handleNextToShowGraph = (data) => {
    setDataBetweenComponents(data);
    setShowChooseAsset(false);
  };

  const returnShowGraph = (data) => {
    console.log(data.selectedValue);
    if (data.selectedValue === "rmf") {
      return <RmfFactsheet data={dataBetweenComponents} />;
    } else if (data.selectedValue === "deposit") {
      return <DepositFactsheet data={dataBetweenComponents} />;
    }
  };

  return (
    <React.Fragment>
      <Navigate />
      {showFormGoal && <FormGoal sendData={handleNextToChooseAsset} />}
      {showChooseAsset && (
        <ChooseAsset
          sendData={handleNextToShowGraph}
          data={dataBetweenComponents}
        />
      )}
      {!showFormGoal &&
        !showChooseAsset &&
        returnShowGraph(dataBetweenComponents)}
    </React.Fragment>
  );
};
