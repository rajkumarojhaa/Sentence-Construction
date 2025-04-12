import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Clock, ListOrdered } from "lucide-react";
import { testData } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import {  
  Dialog,  
  DialogContent,  
  DialogHeader,  
  DialogTitle,  
  DialogDescription,  
  DialogFooter,  
} from "@/components/ui/dialog";  

export default function SentenceConstruction() {
  const [startTest, setStartTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerExpired, setTimerExpired] = useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const questions = testData.data.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);

  // Function to handle the start of the test
  useEffect(() => {
    if (!startTest || !currentQuestion) return;
    const blankCount = (currentQuestion.question.match(/_{10,}/g) || []).length;
    setSelectedWords(Array(blankCount).fill(null));
    setAvailableOptions([...currentQuestion.options]);
    setTimeLeft(30);
    setTimerExpired(false);
  }, [currentQuestionIndex, startTest]);

  // Timer logic
  useEffect(() => {
    if (!startTest || isGameOver || timerExpired) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [startTest, isGameOver, timerExpired]);

  useEffect(() => {
    if (timerExpired) {
      handleNextQuestion();
    }
  }, [timerExpired]);

  // Function to handle the click on a word
  const handleWordSelect = (word) => {
    const index = selectedWords.findIndex((w) => w === null);
    if (index !== -1) {
      const newWords = [...selectedWords];
      newWords[index] = word;
      setSelectedWords(newWords);
      setAvailableOptions((prev) => prev.filter((w) => w !== word));
    }
  };

  // Function to handle the click on a blank space
  // It removes the selected word from the blank and adds it back to available options
  const handleBlankClick = (index) => {
    if (selectedWords[index]) {
      const word = selectedWords[index];
      setAvailableOptions((prev) => [...prev, word]);
      const newWords = [...selectedWords];
      newWords[index] = null;
      setSelectedWords(newWords);
    }
  };

  // Function to save the user's answer
  const saveAnswer = (answerWords, isSkipped = false) => {
    const isCorrect =
      !isSkipped &&
      JSON.stringify(answerWords) ===
        JSON.stringify(currentQuestion.correctAnswer);
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.questionId,
        userAnswer: [...answerWords],
        isCorrect,
        skipped: isSkipped,
      },
    ]);
  };

  // Function to handle the next question
  const handleNextQuestion = (skip = false) => {
    const answerToSave = skip ? [] : selectedWords;
    saveAnswer(answerToSave, skip);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  // Function to handle the quit button click
  // It saves the remaining questions as skipped in the userAnswers state
   // New function to handle quit confirmation  
   const confirmQuit = () => {  
    setIsQuitDialogOpen(true);  
  };  

  // New function to handle actual quit action  
  const handleQuitConfirmed = () => {  
    const remainingQuestions = questions.slice(currentQuestionIndex);  
    const remainingAnswers = remainingQuestions.map((q) => ({  
      questionId: q.questionId,  
      userAnswer: [],  
      isCorrect: false,  
      skipped: true,  
    }));  
    setUserAnswers((prev) => [...prev, ...remainingAnswers]);  
    setIsGameOver(true);  
    setIsQuitDialogOpen(false);  
  }; 

  // Function to render the question with the selected answers highlighted
  const renderSentence = () => {
    const parts = currentQuestion.question.split(/_{10,}/g);
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span
            onClick={() => handleBlankClick(index)}
            className={`inline-block min-w-36 px-2 py-1 mx-1 my-1 border-b-2 text-center ${
              selectedWords[index]
                ? "bg-blue-100 border-blue-500 cursor-pointer"
                : "border-gray-400"
            }`}
          >
            {selectedWords[index] || "____________"}
          </span>
        )}
      </span>
    ));
  };

  // This function replaces the underscores in the question with the selected answers
  const renderQuestionWithAnswers = (question, answers) => {
    const parts = question.question.split(/_{10,}/g);
    return parts
      .map((part, index) =>
        index < answers.length ? `${part}**${answers[index]}**` : part
      )
      .join("");
  };

  //After the test is over, the user can restart the test
  const handleRestart = () => {
    setStartTest(false);
    setCurrentQuestionIndex(0);
    setSelectedWords([]);
    setTimeLeft(30);
    setTimerExpired(false);
    setAvailableOptions([]);
    setUserAnswers([]);
    setIsGameOver(false);
  };
  

  const score = userAnswers.filter((a) => a.isCorrect).length;

  if (!startTest) {
    return (
      <Card className="w-full max-w-3xl mx-2 bg-slate-300 shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold">Sentence Construction</h1>
          <p className="text-gray-600">
            Arrange words to complete each sentence within 30 seconds per
            question.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
            <div className="flex items-center justify-center gap-2 bg-blue-100 p-4 rounded-lg shadow">
              <Clock className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Timer</p>
                <p className="text-lg font-semibold">30 sec</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 bg-green-100 p-4 rounded-lg shadow">
              <ListOrdered className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-lg font-semibold">{questions.length}</p>
              </div>
            </div>
          </div>
          <Button className="mt-8 w-full" onClick={() => setStartTest(true)}>
            Start
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGameOver) {
    return (
      <Card className="w-full max-w-4xl mx-2  p-4">
        <CardContent className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-green-600">
              Quiz Completed!
            </h1>
            <p className="text-xl flex items-center justify-center gap-2">
              <span
                className={`w-24 h-24 flex items-center justify-center rounded-full text-3xl font-medium border-7 ${
                  score >= questions.length * 0.7
                    ? "border-green-500 text-green-600"
                    : score >= questions.length * 0.4
                    ? "border-orange-500 text-orange-500"
                    : "border-red-500 text-red-500"
                }`}
              >
                {score}
              </span>
            </p>
          </div>
          <div className="grid gap-4">
            {questions.map((q, i) => {
              const a = userAnswers[i];
              const correct = a?.isCorrect;
              return (
                <div
                  key={q.questionId}
                  className={`p-4 rounded-lg border ${
                    correct
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {correct ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <AlertCircle className="text-red-500" />
                    )}
                    <h3 className="font-semibold text-base">
                      Question {i + 1} - {correct ? "Correct" : "Incorrect"}
                    </h3>
                  </div>
                  <p className="text-sm mb-1">
                    {renderQuestionWithAnswers(q, a?.userAnswer || [])}
                  </p>
                  {!correct && (
                    <p className="text-xs text-gray-500">
                      Correct: {renderQuestionWithAnswers(q, q.correctAnswer)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Button className="w-full mt-4" onClick={handleRestart}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="w-full max-w-4xl mx-2 shadow-lg rounded-lg">
      <CardContent className="p-6 relative">
      <button  
            className="absolute top-0 right-6 text-red-600 hover:text-red-800 font-semibold underline text-sm"  
            onClick={confirmQuit}  
          >  
            Quit  
          </button> 

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="text-lg font-medium text-gray-700">Time: {timeLeft}s</p>
        </div>

        <Progress
          value={(timeLeft / 30) * 100}
          className={`mb-6 h-2 bg-slate-200 ${
            timeLeft <= 10 ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500"
          }`}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="text-lg mb-6 leading-relaxed">
              {renderSentence()}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="h-auto py-2 text-base"
                  onClick={() => handleWordSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex  sm:flex-row gap-4 mt-6 ">
          <Button className="w-[49%]" onClick={() => handleNextQuestion(true)}>
            Skip
          </Button>
          <Button
            className="sm:w-[49%] w-[46%]"
            disabled={selectedWords.includes(null)}
            onClick={() => handleNextQuestion()}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </CardContent>
    </Card>
     {/* Quit Confirmation Dialog */}  
     <Dialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>  
        <DialogContent>  
          <DialogHeader>  
            <DialogTitle>Confirm Quit</DialogTitle>  
            <DialogDescription>  
              Are you sure you want to quit the test?   
              All remaining questions will be marked as skipped.  
            </DialogDescription>  
          </DialogHeader>  
          <DialogFooter>  
            <Button   
              variant="outline"   
              onClick={() => setIsQuitDialogOpen(false)}  
            >  
              Cancel  
            </Button>  
            <Button   
              variant="destructive"   
              onClick={handleQuitConfirmed}  
            >  
              Quit Test  
            </Button>  
          </DialogFooter>  
        </DialogContent>  
      </Dialog> 
    </>
  );
}
