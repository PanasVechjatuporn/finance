import React, { useState } from "react";
import Navigate from "components/Navbar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import questions from "../components/question";
import "./normalGoal.css";

export const Goal = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(
        Array(questions.length).fill(null)
    );
    const [isOptionSelected, setIsOptionSelected] = useState(false); // New state to track if an option is selected

    const handleOptionChange = (index, weight) => {
        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions[currentQuestionIndex] = { index, weight };
        setSelectedOptions(updatedSelectedOptions);
        setIsOptionSelected(true);

        console.log(index, weight);
        // Optionally calculate score immediately upon selection
        // or you can calculate the total score at the end of the quiz
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsOptionSelected(false);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setIsOptionSelected(selectedOptions[currentQuestionIndex - 1] != null); // Check if the previous question had a selection
        }
    };

    const calculateScore = () => {
        const totalScore = selectedOptions.reduce(
            (acc, curr) => acc + (curr ? curr.weight : 0),
            0
        );
        setScore(totalScore);
    };

    const { question, options } = questions[currentQuestionIndex];

    return (
        <React.Fragment>
            <Navigate />
            <Container fixed>
                <div>
                    <div className="MultipleChoiceForm">
                        <FormControl>
                            <h2>Question {currentQuestionIndex + 1}</h2>
                            <div>
                                <FormLabel id="demo-radio-buttons-group-label" className="QuestionHeader">
                                    <h4>{question}</h4>
                                </FormLabel>
                            </div>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                            >
                                {options.map((options, index) => (
                                    <FormControlLabel
                                        value={options.weight}
                                        control={<Radio />}
                                        label={options.text}
                                        onChange={(e) =>
                                            handleOptionChange(index, options.weight, e)
                                        }
                                        checked={
                                            selectedOptions[currentQuestionIndex]?.index === index
                                        }
                                        sx={{ margin: 1 }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="NextAndPrevButton">
                        <Stack spacing={2} direction="row">
                            {currentQuestionIndex > 0 && (
                                <Button variant="outlined" onClick={prevQuestion}>Back</Button>
                            )}
                            {currentQuestionIndex < questions.length - 1 ? (
                                <Button variant="outlined" onClick={nextQuestion}>Next</Button>
                            ) : (
                                <Button variant="contained" onClick={calculateScore}>Finish</Button>
                            )}
                        </Stack>
                    </div>
                    <div>Score: {score}</div>
                </div>
            </Container>
        </React.Fragment>
    );
};
