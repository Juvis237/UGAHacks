"use client";

import { useState, useEffect } from "react";
import Question from "./question";
import BattleIndicator from "./battle-indicator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { gameSessionId, questions } from "@/lib/utils";
import { db, doc, setDoc, onSnapshot, collection } from "@/lib/firebase";
import { getDoc } from "firebase/firestore";

type ProgressStatus = "correct" | "incorrect" | "unanswered";

const QuizBattle = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [resultsMessage, setResultsMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [playerProgress, setPlayerProgress] = useState<ProgressStatus[]>(
    Array(questions.length).fill("unanswered")
  );
  const [opponentProgress, setOpponentProgress] = useState<ProgressStatus[]>(
    Array(questions.length).fill("unanswered")
  );
  const [timer, setTimer] = useState(10);
  const userId = localStorage.getItem("userId");
  const defaultProgress = Array(questions.length).fill("unanswered");
  useEffect(() => {
    // 🔥 Listen for opponent's progress updates in Firestore
    const playersRef = collection(db, `games/${gameSessionId}/players`);

    const unsubscribe = onSnapshot(playersRef, (snapshot) => {
      let opponentData: {
        currentQuestion: number;
        progress: ProgressStatus[];
      } = {
        currentQuestion: -1, // Default value
        progress: Array(10).fill("unanswered"), // Default progress
      };

      snapshot.forEach((doc) => {
        const playerId = doc.id; // Each document ID is a player ID
        const playerData = doc.data();

        if (playerId !== userId) {
          opponentData = playerData as {
            currentQuestion: number;
            progress: ProgressStatus[];
          };
        }
      });

      if (opponentData) {
        setOpponentProgress(opponentData.progress);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [gameSessionId, userId]);
  useEffect(() => {
    if (timer === 0) {
      goToNextQuestion();
      return;
    } // Stop countdown at 0

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0)); // Ensure it doesn't go below 0
    }, 1000);

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, [timer]);

  const handleAnswer = async (selectedAnswer: string) => {
    setSelectedAnswer(selectedAnswer);
    setIsAnswered(true);

    const isCorrect =
      selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    const newProgress = [...playerProgress];
    newProgress[currentQuestionIndex] = isCorrect ? "correct" : "incorrect";
    setPlayerProgress(newProgress);

    // 🔥 Save answer in Firestore under the game session
    // Replace with real game session ID
    //const userId = `player${Math.random()}`; // Replace with real user ID

    try {
      await setDoc(doc(db, `games/${gameSessionId}/players/${userId}`), {
        currentQuestion: currentQuestionIndex,
        progress: newProgress,
      });
      console.log("Answer saved to Firestore ✅");
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimer(10);
    } else {
      getResults();
      setShowResults(true);
    }
  };

  const restartQuiz = async () => {
    setCurrentQuestionIndex(0);
    setTimer(10);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setPlayerProgress(Array(questions.length).fill("unanswered"));
    setOpponentProgress(Array(questions.length).fill("unanswered"));

    // 🔥 Reset progress in Firestore for both users
    const gameSessionId = "juv237"; // Replace with actual game session ID

    try {
      await Promise.all([
        setDoc(doc(db, `games/${gameSessionId}/players/user1`), {
          currentQuestion: 0,
          progress: defaultProgress,
        }),
        setDoc(doc(db, `games/${gameSessionId}/players/user2`), {
          currentQuestion: 0,
          progress: defaultProgress,
        }),
      ]);

      console.log("Quiz restarted, progress reset for user1 and user2 ✅");
    } catch (error) {
      console.error("Error resetting quiz progress:", error);
    }
  };

  const getResults = async () => {
    try {
      // 🔥 Get progress data for user1 and user2
      const user1Ref = doc(db, `games/${gameSessionId}/players/user1`);
      const user2Ref = doc(db, `games/${gameSessionId}/players/user2`);

      const user1Snapshot = await getDoc(user1Ref);
      const user2Snapshot = await getDoc(user2Ref);

      const user1Progress = user1Snapshot.exists()
        ? user1Snapshot.data().progress || []
        : [];
      const user2Progress = user2Snapshot.exists()
        ? user2Snapshot.data().progress || []
        : [];

      // 🔥 Count correct answers
      const user1Score = user1Progress.filter(
        (status: string) => status === "correct"
      ).length;
      const user2Score = user2Progress.filter(
        (status: string) => status === "correct"
      ).length;

      let resultMessage = "";
      if (user1Score > user2Score) {
        resultMessage = userId === "user1" ? "You Win! 🎉" : "You Lose! 😞";
        setResultsMessage(resultMessage);
      } else if (user1Score < user2Score) {
        resultMessage = userId === "user2" ? "You Win! 🎉" : "You Lose! 😞";
        setResultsMessage(resultMessage);
      } else {
        resultMessage = "It's a Tie! ⚖️";
        setResultsMessage(resultMessage);
      }

      console.log(resultMessage);
      //alert(resultMessage); // Show result to players

      console.log("get results ran");
    } catch (error) {
      console.error("Error resetting quiz progress:", error);
    }
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          Quiz Results
        </h2>
        <p
          className={`text-lg font-bold ${
            resultsMessage.includes("Win")
              ? "text-green-500"
              : resultsMessage.includes("Lose")
              ? "text-red-500"
              : "text-orange-500"
          }`}
        >
          {resultsMessage}
        </p>

        <p className="text-xl mb-6 text-zinc-700 dark:text-zinc-300">
          You scored {score} out of {questions.length}
        </p>

        <Button onClick={restartQuiz} className="flex items-center gap-2">
          Play Again
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        Financial Quiz Battle
      </h1>
      {/* Timer Countdown */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          Time Left
        </p>
        <div className="text-lg font-bold text-red-500">{timer}s</div>
      </div>
      <BattleIndicator
        totalQuestions={questions.length}
        playerProgress={playerProgress}
        opponentProgress={opponentProgress}
      />
      <Question
        question={questions[currentQuestionIndex].question}
        options={questions[currentQuestionIndex].options}
        correctAnswer={questions[currentQuestionIndex].correctAnswer}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        isAnswered={isAnswered}
      />
      <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      {isAnswered && (
        <div className="mt-6">
          <Button
            onClick={goToNextQuestion}
            className="flex items-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "See Results"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizBattle;
