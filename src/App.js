import { useState, useEffect, useRef, memo } from "react";

import styled, { createGlobalStyle, css, keyframes } from "styled-components";

console.clear();

// const App = () => {
//   return (
//     <div className="App">
//       <div className="h1">
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum ex
//         voluptatibus iure sed accusamus incidunt!
//       </div>
//       <div className="text">
//         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus
//         laboriosam est facere aperiam rerum, corporis aliquid velit deleniti
//         architecto libero autem! Eveniet quod vel nesciunt.
//       </div>
//       <button>button</button>
//     </div>
//   );
// };

// export default App;

const GlobalStyle = createGlobalStyle`
  body {
    background: #151515;
    color: silver;
    font-family: SF Mono;
    font-size: 1.6rem;
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
  width: 75%;
  margin-inline: auto;
`;

const HeadingStyle = styled.div`
  ${Flex_Column_Rounded};
  padding: 0;
  font-size: 2rem;
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

const ButtonStyle = styled.button`
  all: unset;
  /* background: #343434; */
  background: ${(props) => props.color || "#343434"};
  border-radius: 0.4rem;
  padding: 1rem 1.6rem;
  flex: 1;
  text-align: center;
  cursor: pointer;
  pointer-events: ${props => props.disable && "none"};

  transition: 0.25s;
  &:hover {
    filter: brightness(1.25);
  }
`;

const AnswerWrapperStyle = styled.div`
  height: ${(props) => props.height || 0};
  overflow: hidden;
  transition: 0.25s;
`;

const AnswerWrapper = ({ children }) => {
  const [height, setHeight] = useState(0);
  const answerRef = useRef(null);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(`${answerRef.current.scrollHeight}px`);
    }
  }, []);

  return (
    <AnswerWrapperStyle ref={answerRef} height={height}>
      {children}
    </AnswerWrapperStyle>
  );
};

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

const App = () => {
  const [color, setColor] = useState(getRandomColor());
  const tempArray = [
    ...Array(4)
      .fill()
      .map(() => getRandomColor()),
    color
  ].sort(() => 0.5 - Math.random());
  const [buttonsArray, setButtonsArray] = useState(tempArray);

  const [rightAnswer, setRightAnswer] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState();

  const answerDuration = 1200;
  const resetApp = () => {
    setColor(getRandomColor());
    setSelectedAnswer();
  };

  useEffect(() => {
    setButtonsArray(tempArray);
  }, [color]);

  const [disableClick, setDisableClick] = useState(false);
  const handelClick = (e) => {
    if (disableClick) return;
    setDisableClick(true);

    setSelectedAnswer(e);
    if (e === color) {
      setRightAnswer(true);
      setTimeout(() => {
        setRightAnswer(false);
        resetApp();
      }, answerDuration);
    } else {
      setWrongAnswer(true);
      setTimeout(() => {
        setWrongAnswer(false);
        resetApp();
      }, answerDuration);
    }
    setTimeout(() => setDisableClick(false), answerDuration);
  };

  return (
    <>
      <GlobalStyle />
      <AppStyle>
        <HeadingStyle>Guess The Color</HeadingStyle>
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
        {rightAnswer && (
          <AnswerWrapper>
            <RightAnswerStyle>RIGHT ANSWER :)</RightAnswerStyle>
          </AnswerWrapper>
        )}
        {wrongAnswer && (
          <AnswerWrapper>
            <WrongAnswerStyle>WRONG ANSWER :(</WrongAnswerStyle>
          </AnswerWrapper>
        )}
      </AppStyle>
    </>
  );
};

export default App;
