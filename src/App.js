import { useState, useEffect, useRef } from "react";

import styled, { createGlobalStyle, css } from "styled-components";

import Animate from "./Animate.js";

console.clear();

const GlobalStyle = createGlobalStyle`
  body {
    background: #151515;
    color: silver;
    font-family: SF Mono;
    font-size: 1.2rem;
    margin: 0;
    padding: 2rem;
  }
`;

const Flex_Column_Rounded = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1rem;
  padding: 1rem;
`;

const AppStyle = styled.div`
  ${Flex_Column_Rounded};
  /* max-width: 500px; */
  background: #212121;
  width: min(calc(100% - 2rem), 500px);
  margin-inline: auto;
`;

const HeadingStyle = styled.div`
  ${Flex_Column_Rounded};
  padding: 0;
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
`;

const ColoredBoxStyle = styled.div`
  ${Flex_Column_Rounded};
  background: ${(props) => props.color};
  height: 200px;

  transition: 0.25s;
`;

const Buttons = styled.div`
  ${Flex_Column_Rounded};
  flex-direction: row;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const ButtonStyle = styled.div`
  background: ${(props) => props.color || "#343434"};
  border-radius: 0.4rem;
  padding: 1rem 1.6rem;
  flex: 1;
  text-align: center;
  cursor: pointer;
  pointer-events: ${(props) => props.disable && "none"};

  transition: 0.25s;
  &:hover {
    filter: brightness(1.25);
  }
`;

const AnswerWrapperStyle = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const answerStyle = css`
  ${Flex_Column_Rounded};
  border-radius: 0.4rem;
  text-align: center;
`;

const RightAnswerStyle = styled.div`
  ${answerStyle};
  background: hsl(140 50% 25%);
`;

const WrongAnswerStyle = styled.div`
  ${answerStyle};
  background: hsl(0 50% 25%);
`;

const PopupWrapperStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0008;
`;

const PopupStyle = styled.div`
  ${Flex_Column_Rounded};
  background: #212121;
  max-width: min(calc(100% - 8rem), calc(500px - 4rem));
`;

const hexLetters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
];

const getRandomLetter = () => {
  return hexLetters[Math.floor(Math.random() * 16)];
};

const getRandomColor = () => {
  return `#${Array(6)
    .fill("anything")
    .map(() => getRandomLetter())
    .join("")}`;
};

const AnswerComponent = ({ answer, type, resetApp }) => {
  const [height, setHeight] = useState("200px");
  const heightRef = useRef(null);

  const onEnter = () => {
    setHeight(`${heightRef.current.scrollHeight}px`);
  };

  return (
    <Animate
      on={answer}
      duration={400}
      easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
      from={{
        opacity: 0,
        transform: "translate(0, -0rem) scale(0.95)",
        marginTop: "-1rem",
        height: 0
      }}
      to={{
        opacity: 1,
        transform: "translate(0, 0rem) scale(1)",
        marginTop: 0,
        height: height
      }}
      onEnter={onEnter}
      unMountOnExit
    >
      <AnswerWrapperStyle ref={heightRef}>
        {type === "right" && (
          <RightAnswerStyle>Right Answer :)</RightAnswerStyle>
        )}
        {type === "wrong" && (
          <WrongAnswerStyle>Wrong Answer :(</WrongAnswerStyle>
        )}
        <ButtonStyle onClick={() => resetApp()}>Play Again</ButtonStyle>
      </AnswerWrapperStyle>
    </Animate>
  );
};

const PopupComponent = ({ openPopup, setOpenPopup, setNum_of_btns }) => {
  const popupRef = useRef(null);

  const handelClick = (e) => {
    setNum_of_btns(e);
    setOpenPopup(false);
  };

  return (
    <Animate
      on={openPopup}
      duration={400}
      easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
      from={{
        opacity: 0
      }}
      to={{
        opacity: 1
      }}
      unMountOnExit
    >
      <PopupWrapperStyle
        ref={popupRef}
        onClick={(e) => e.target === popupRef.current && setOpenPopup(false)}
      >
        <Animate
          on={openPopup}
          duration={400}
          easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
          from={{
            opacity: 0,
            transform: "scale(0.9) translate(0, 2rem)"
          }}
          to={{
            opacity: 1,
            transform: "scale(1) translate(0, 0rem)"
          }}
          unMountOnExit
        >
          <PopupStyle>
            <Buttons style={{ maxWidth: 500 }}>
              {Array(10)
                .fill()
                .map((e, i) => {
                  return (
                    <ButtonStyle key={i} onClick={() => handelClick(i + 1)}>
                      {i + 1}
                    </ButtonStyle>
                  );
                })}
            </Buttons>
            <ButtonStyle onClick={() => setOpenPopup(false)}>Close</ButtonStyle>
          </PopupStyle>
        </Animate>
      </PopupWrapperStyle>
    </Animate>
  );
};

const App = () => {
  const [color, setColor] = useState(getRandomColor());
  const [num_of_btns, setNum_of_btns] = useState(3);

  const [otherBtns, setOtherBtns] = useState(
    [
      ...Array(num_of_btns - 1)
        .fill()
        .map(() => getRandomColor()),
      color
    ].sort(() => 0.5 - Math.random())
  );
  useEffect(() => {
    setOtherBtns(
      [
        ...Array(num_of_btns - 1)
          .fill()
          .map(() => getRandomColor()),
        color
      ].sort(() => 0.5 - Math.random())
    );
  }, [num_of_btns, color]);

  const [buttonsArray, setButtonsArray] = useState(otherBtns);

  const [rightAnswer, setRightAnswer] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [disableClick, setDisableClick] = useState(false);

  const resetApp = () => {
    setColor(getRandomColor());
    setSelectedAnswer();
    setRightAnswer();
    setWrongAnswer();
    setDisableClick(false);
  };

  useEffect(() => setButtonsArray(otherBtns), [color, otherBtns]);

  const handelClick = (e) => {
    if (disableClick) return;
    setDisableClick(true);

    setSelectedAnswer(e);
    if (e === color) {
      setRightAnswer(true);
    } else {
      setWrongAnswer(true);
    }
  };

  const [openPopup, setOpenPopup] = useState(false);

  const hex_TO_rgb = (hex) => {
    return `rgb(${Array(3)
      .fill(null)
      .map((e, i) => {
        return parseInt(
          hex
            .slice(1)
            .split("")
            .splice(2 * i, 2)
            .join(""),
          16
        );
      })
      .join(", ")})`;
  };

  return (
    <>
      <GlobalStyle />
      <AppStyle>
        <HeadingStyle>Guess The Color</HeadingStyle>
        <ButtonStyle onClick={() => setOpenPopup(true)}>
          Select Number of Buttons
        </ButtonStyle>
        <ColoredBoxStyle color={color} />
        <Buttons>
          {buttonsArray.map((e, i) => {
            return (
              <ButtonStyle
                key={i}
                onClick={() => handelClick(e)}
                color={
                  (e === selectedAnswer &&
                    (e === color ? "hsl(140 50% 25%)" : "hsl(0 50% 25%)")) ||
                  (selectedAnswer && e === color && "hsl(140 50% 25%)")
                }
                disable={disableClick}
              >
                {e}
              </ButtonStyle>
            );
          })}
        </Buttons>

        <AnswerComponent
          type="right"
          answer={rightAnswer}
          resetApp={() => resetApp()}
        />
        <AnswerComponent
          type="wrong"
          answer={wrongAnswer}
          resetApp={() => resetApp()}
        />

        <PopupComponent
          openPopup={openPopup}
          setOpenPopup={(e) => setOpenPopup(e)}
          setNum_of_btns={(e) => setNum_of_btns(e)}
        />
      </AppStyle>
    </>
  );
};

export default App;
