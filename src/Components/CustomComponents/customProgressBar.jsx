import React from "react";
import { GiChocolateBar } from "react-icons/gi";
import "../../styles/CustomProgressBar.css";
const CustomProgressBar = ({ bgcolor, progress, height }) => {
  const Parentdiv = {
    height: height,
    width: "100%",
    backgroundColor: "#deddd9",
    borderRadius: 40,
    borderColor: "#5cb8b2",
  };
  //#eead1a

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 40,
    textAlign: "right",
  };

  const chocoPosition = {
    position: "relative",
    right: progress > 89 || progress < 10 ? 0 : -10,
    with: "10%",
  };

  const rotateYAnimation = {
    animation: "rotateY 4s infinite", // Apply the animation here
    backgroundColor: "#753bbd",
    borderRadius: 40,
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span>
          {
            <div style={chocoPosition}>
              <GiChocolateBar
                color="white"
                size="25px"
                style={rotateYAnimation}
              />
            </div>
          }
        </span>
      </div>
    </div>
  );
};

export default CustomProgressBar;
