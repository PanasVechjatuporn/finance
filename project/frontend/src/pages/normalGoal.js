import React, { useState } from "react";

import Navigate from "components/Navbar";

import { FormGoal } from "components/formNormalGoal_normalGoal";
import { Graph } from "components/graph_normalGoal";

import "./normalGoal.css";

export const NormalGoal = () => {
  const [showFormGoal, setShowFormGoal] = useState(true);
  const [dataBetweenComponents, setDataBetweenComponents] = useState({});

  const handleNextToShowGraph = (data) => {
    setDataBetweenComponents(data);
    setShowFormGoal(false)
  };


  return (
    <React.Fragment>
      <Navigate />
      {showFormGoal && <FormGoal sendData={handleNextToShowGraph} />}

      {!showFormGoal && <Graph data={dataBetweenComponents}/>}
    </React.Fragment>
  );
};
