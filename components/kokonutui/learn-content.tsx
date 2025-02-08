"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronRight,
  ChevronDown,
  BarChart2,
  PieChart,
  TrendingUp,
  Lock,
  CheckCircle,
} from "lucide-react";
import useProgress from "@/hooks/useProgress";
import { usePoints } from "@/context/PointsContext";
import type React from "react";

// CSS variables for sidebar width
const SIDEBAR_WIDTH = "16rem";

// -------------------------
// TypeScript Interfaces
// -------------------------
interface Slide {
  title: string;
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Each lesson now has its own slides and quizQuestions.
interface Lesson {
  title: string;
  locked: boolean;
  slides: Slide[];
  quizQuestions: QuizQuestion[];
}

interface Module {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  lessons: Lesson[];
}

interface LessonItemProps {
  lesson: Lesson;
  onClick: () => void;
}

interface SlideshowProps {
  slides: Slide[];
  onComplete: () => void;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (earned: number) => void;
}

interface ModuleCardProps {
  module: Module;
}

// -------------------------
// Sample Data Arrays
// -------------------------

const modules: Module[] = [
  {
    title: "Balance Sheet",
    description: "Assets, Liabilities, and Equity.",
    icon: PieChart,
    color: "bg-blue-500",
    lessons: [
      {
        title: "Introduction to Balance Sheets",
        locked: false,
        slides: [
          {
            title: "What is a Balance Sheet?",
            content:
              "A balance sheet provides a snapshot of a company's financial position at a specific moment in time. It shows what the company owns, owes, and the net worth of the owners.",
          },
          {
            title: "Key Components",
            content:
              "It is divided into assets, liabilities, and equity. Each part gives insight into the company’s overall financial health.",
          },
          {
            title: "Assets Explained",
            content:
              "Assets include cash, property, equipment, and other resources that have value and help generate revenue.",
          },
          {
            title: "Liabilities & Equity",
            content:
              "Liabilities are obligations and debts; equity represents the residual interest of the owners after liabilities are deducted.",
          },
        ],
        quizQuestions: [
          {
            question: "What does a balance sheet show?",
            options: [
              "Revenue and expenses",
              "Assets, liabilities, and equity",
              "Cash flow details",
              "Market trends",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which of the following is considered an asset?",
            options: [
              "Accounts Payable",
              "Inventory",
              "Loans",
              "Accrued Expenses",
            ],
            correctAnswer: 1,
          },
          {
            question: "What is equity?",
            options: [
              "Total debts of the company",
              "Owners’ residual interest",
              "Cash available for operations",
              "Expenses incurred",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which section is not on a balance sheet?",
            options: ["Assets", "Liabilities", "Equity", "Revenue"],
            correctAnswer: 3,
          },
        ],
      },
      {
        title: "Assets and Liabilities",
        locked: true,
        slides: [
          {
            title: "Understanding Assets",
            content:
              "Assets are valuable resources owned by a company. They can be tangible, like equipment, or intangible, like patents.",
          },
          {
            title: "Types of Assets",
            content:
              "Assets are classified as current (convertible to cash within a year) or non-current (long-term investments).",
          },
          {
            title: "Understanding Liabilities",
            content:
              "Liabilities are obligations or debts the company must settle in the future.",
          },
          {
            title: "Types of Liabilities",
            content:
              "They are divided into current liabilities (short-term) and long-term liabilities.",
          },
        ],
        quizQuestions: [
          {
            question:
              "What distinguishes a current asset from a non-current asset?",
            options: [
              "Current assets can be quickly converted to cash.",
              "Non-current assets are more valuable.",
              "Current assets are always intangible.",
              "Non-current assets are short term.",
            ],
            correctAnswer: 0,
          },
          {
            question: "Which is a current liability?",
            options: [
              "Long-term debt",
              "Accounts Payable",
              "Property, Plant, Equipment",
              "Retained Earnings",
            ],
            correctAnswer: 1,
          },
          {
            question: "What best describes liabilities?",
            options: [
              "Company’s resources",
              "Company’s obligations",
              "Company’s market share",
              "Company’s revenues",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which is typically a non-current asset?",
            options: [
              "Cash",
              "Inventory",
              "Property, Plant, and Equipment",
              "Accounts Receivable",
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        title: "Equity and Balance Sheet Analysis",
        locked: true,
        slides: [
          {
            title: "What is Equity?",
            content:
              "Equity represents the owners’ claim on the company’s assets after subtracting liabilities.",
          },
          {
            title: "Components of Equity",
            content:
              "It includes common stock, retained earnings, and additional paid-in capital.",
          },
          {
            title: "Analyzing Equity",
            content:
              "Changes in equity over time can indicate whether the company is growing or facing financial challenges.",
          },
          {
            title: "Financial Health",
            content:
              "A strong equity position generally indicates long-term stability and good financial health.",
          },
        ],
        quizQuestions: [
          {
            question: "What does equity represent?",
            options: [
              "The company’s debts",
              "Owners’ residual interest",
              "Operating expenses",
              "Revenue generated",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which component is part of equity?",
            options: [
              "Accounts Payable",
              "Retained Earnings",
              "Short-term Loans",
              "Inventory",
            ],
            correctAnswer: 1,
          },
          {
            question: "What can changes in equity indicate?",
            options: [
              "Financial growth or decline",
              "Cash flow fluctuations",
              "Market volatility",
              "Tax liabilities",
            ],
            correctAnswer: 0,
          },
          {
            question: "A strong equity position usually indicates:",
            options: [
              "Poor financial health",
              "High debt levels",
              "Long-term stability",
              "Rapid asset depreciation",
            ],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Income Statement",
    description: "Revenue, Expenses, and Profitability.",
    icon: BarChart2,
    color: "bg-green-500",
    lessons: [
      {
        title: "Basics of Income Statements",
        locked: false,
        slides: [
          {
            title: "What is an Income Statement?",
            content:
              "An income statement, also known as a profit and loss statement, summarizes a company’s revenues, expenses, and profits over a set period.",
          },
          {
            title: "Revenue",
            content:
              "Revenue is the total income generated from the sale of goods or services. It is a key indicator of business performance.",
          },
          {
            title: "Expenses",
            content:
              "Expenses are the costs incurred to earn revenue, including operational costs, salaries, and rent.",
          },
          {
            title: "Profitability",
            content:
              "The bottom line is net income, which represents profit after all expenses have been deducted.",
          },
        ],
        quizQuestions: [
          {
            question: "What does an income statement summarize?",
            options: [
              "Assets and liabilities",
              "Revenue, expenses, and profits",
              "Cash flow",
              "Equity and debt",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which represents total income before expenses?",
            options: [
              "Revenue",
              "Net Income",
              "Gross Profit",
              "Operating Income",
            ],
            correctAnswer: 0,
          },
          {
            question: "What are expenses?",
            options: [
              "Costs incurred to earn revenue",
              "Money earned from sales",
              "The company’s equity",
              "Long-term assets",
            ],
            correctAnswer: 0,
          },
          {
            question: "Net income is:",
            options: [
              "Revenue minus expenses",
              "Total revenue",
              "Total expenses",
              "Revenue plus expenses",
            ],
            correctAnswer: 0,
          },
        ],
      },
      {
        title: "Revenue and Expense Recognition",
        locked: true,
        slides: [
          {
            title: "Revenue Recognition",
            content:
              "Revenue is recorded when it is earned, not necessarily when cash is received. This principle ensures that financial statements accurately reflect business performance.",
          },
          {
            title: "Expense Recognition",
            content:
              "Expenses are recorded when incurred, regardless of when payment is made, ensuring that costs are matched with the revenues they help generate.",
          },
          {
            title: "Matching Principle",
            content:
              "This principle requires that expenses be matched with related revenues in the same period.",
          },
          {
            title: "Impact on Profitability",
            content:
              "Proper recognition of revenue and expenses directly affects the company’s reported profitability.",
          },
        ],
        quizQuestions: [
          {
            question: "When is revenue recognized?",
            options: [
              "When cash is received",
              "When earned",
              "At the end of the year",
              "When expenses are paid",
            ],
            correctAnswer: 1,
          },
          {
            question: "What is the matching principle?",
            options: [
              "Matching assets with liabilities",
              "Matching expenses with related revenues",
              "Matching revenue with equity",
              "Matching cash with profits",
            ],
            correctAnswer: 1,
          },
          {
            question: "Expenses are recorded when they are:",
            options: ["Incurred", "Paid", "Collected", "Forecasted"],
            correctAnswer: 0,
          },
          {
            question: "Proper revenue recognition ensures:",
            options: [
              "Accurate profit reporting",
              "Increased cash flow",
              "Higher asset values",
              "Lower liabilities",
            ],
            correctAnswer: 0,
          },
        ],
      },
      {
        title: "Profitability Ratios",
        locked: true,
        slides: [
          {
            title: "Introduction to Ratios",
            content:
              "Profitability ratios measure how efficiently a company converts revenue into profit. They are crucial for assessing operational performance.",
          },
          {
            title: "Gross Profit Margin",
            content:
              "This ratio indicates the percentage of revenue remaining after subtracting the cost of goods sold, showing production efficiency.",
          },
          {
            title: "Net Profit Margin",
            content:
              "Net profit margin shows what percentage of revenue remains as profit after all expenses have been deducted.",
          },
          {
            title: "Return on Sales",
            content:
              "This ratio measures operating efficiency by comparing operating profit to revenue.",
          },
        ],
        quizQuestions: [
          {
            question: "What does the gross profit margin measure?",
            options: [
              "Total revenue",
              "Percentage of revenue after COGS",
              "Net income",
              "Operating expenses",
            ],
            correctAnswer: 1,
          },
          {
            question: "Net profit margin is calculated as:",
            options: [
              "Net income divided by revenue",
              "Gross profit divided by revenue",
              "Revenue minus expenses",
              "Revenue divided by net income",
            ],
            correctAnswer: 0,
          },
          {
            question: "Which ratio measures operating efficiency?",
            options: [
              "Return on Assets",
              "Return on Sales",
              "Current Ratio",
              "Debt-to-Equity Ratio",
            ],
            correctAnswer: 1,
          },
          {
            question: "Profitability ratios help investors understand:",
            options: [
              "Liquidity",
              "Financial risk",
              "Earnings performance",
              "Asset quality",
            ],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Cash Flow",
    description: "Explore cash inflows and outflows.",
    icon: TrendingUp,
    color: "bg-purple-500",
    lessons: [
      {
        title: "Understanding Cash Flow",
        locked: false,
        slides: [
          {
            title: "What is Cash Flow?",
            content:
              "Cash flow refers to the movement of cash into and out of a business. It is vital for daily operations and long-term planning.",
          },
          {
            title: "Importance of Cash Flow",
            content:
              "Healthy cash flow ensures a company can meet its financial obligations and invest in growth opportunities.",
          },
          {
            title: "Positive vs. Negative",
            content:
              "Positive cash flow indicates more money coming in than going out; negative cash flow suggests potential financial issues.",
          },
          {
            title: "Analyzing Cash Flow",
            content:
              "Regular analysis of cash flow helps monitor liquidity and overall financial stability.",
          },
        ],
        quizQuestions: [
          {
            question: "What does cash flow represent?",
            options: [
              "Company profit",
              "Movement of cash",
              "Total assets",
              "Total liabilities",
            ],
            correctAnswer: 1,
          },
          {
            question: "Why is cash flow important?",
            options: [
              "It shows profitability",
              "It indicates liquidity",
              "It measures equity",
              "It determines market share",
            ],
            correctAnswer: 1,
          },
          {
            question: "Positive cash flow means:",
            options: [
              "More cash out than in",
              "More cash in than out",
              "Equal cash in and out",
              "No cash movement",
            ],
            correctAnswer: 1,
          },
          {
            question: "Cash flow is a key indicator of:",
            options: [
              "Financial health",
              "Company size",
              "Stock price",
              "Market trends",
            ],
            correctAnswer: 0,
          },
        ],
      },
      {
        title: "Operating, Investing, and Financing",
        locked: true,
        slides: [
          {
            title: "Operating Activities",
            content:
              "These are the core business operations that generate cash, including sales and services.",
          },
          {
            title: "Investing Activities",
            content:
              "Investing activities involve buying or selling long-term assets, which can indicate future growth.",
          },
          {
            title: "Financing Activities",
            content:
              "These include cash flows from borrowing, repaying debt, or issuing equity, affecting the company’s capital structure.",
          },
          {
            title: "Differences Explained",
            content:
              "Each category provides distinct insights into how the company manages its funds.",
          },
        ],
        quizQuestions: [
          {
            question: "Which activity is part of operating cash flow?",
            options: [
              "Issuing stock",
              "Selling inventory",
              "Buying equipment",
              "Repaying loans",
            ],
            correctAnswer: 1,
          },
          {
            question: "Investing activities typically include:",
            options: [
              "Borrowing money",
              "Selling long-term assets",
              "Paying salaries",
              "Collecting receivables",
            ],
            correctAnswer: 1,
          },
          {
            question: "Financing activities include:",
            options: [
              "Operating expenses",
              "Debt repayment",
              "Inventory purchases",
              "Revenue generation",
            ],
            correctAnswer: 1,
          },
          {
            question: "What distinguishes these three activities?",
            options: [
              "Cash source and use",
              "Asset value",
              "Market trends",
              "Tax rates",
            ],
            correctAnswer: 0,
          },
        ],
      },
      {
        title: "Cash Flow Analysis Techniques",
        locked: true,
        slides: [
          {
            title: "Analyzing Cash Flow",
            content:
              "Techniques such as ratio and trend analysis help assess a company's liquidity and efficiency.",
          },
          {
            title: "Free Cash Flow",
            content:
              "Free cash flow is the cash remaining after capital expenditures, a key measure of financial flexibility.",
          },
          {
            title: "Interpreting Data",
            content:
              "Understanding cash flow statements can reveal strengths and weaknesses in operations.",
          },
          {
            title: "Key Metrics",
            content:
              "Metrics like the operating cash flow ratio help gauge the company's ability to generate cash.",
          },
        ],
        quizQuestions: [
          {
            question: "What is free cash flow?",
            options: [
              "Total revenue",
              "Cash after capital expenditures",
              "Net income",
              "Total assets",
            ],
            correctAnswer: 1,
          },
          {
            question: "Cash flow analysis helps determine:",
            options: [
              "Market share",
              "Liquidity and efficiency",
              "Shareholder equity",
              "Employee satisfaction",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which ratio is useful in cash flow analysis?",
            options: [
              "Current ratio",
              "Operating cash flow ratio",
              "Debt-to-equity ratio",
              "Gross margin",
            ],
            correctAnswer: 1,
          },
          {
            question: "Cash flow analysis can reveal:",
            options: [
              "Long-term growth prospects",
              "Operational challenges",
              "Both A and B",
              "None of the above",
            ],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
];

// -------------------------
// Framer Motion Variants
// -------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// -------------------------
// Component Definitions
// -------------------------

// Lesson button component.
const LessonItem = ({ lesson, onClick }: LessonItemProps) => (
  <Button
    variant={lesson.locked ? "outline" : "default"}
    className="w-full justify-start mb-2"
    disabled={lesson.locked}
    onClick={onClick}
  >
    {lesson.locked ? (
      <Lock className="w-4 h-4 mr-2" />
    ) : (
      <CheckCircle className="w-4 h-4 mr-2" />
    )}
    {lesson.title}
  </Button>
);

// Slideshow component with centered content.
const Slideshow = ({ slides, onComplete }: SlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <h3 className="text-2xl font-bold mb-2">
          {slides[currentSlide].title}
        </h3>
        <p className="text-base">{slides[currentSlide].content}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {currentSlide + 1} / {slides.length}
        </span>
        <Button size="sm" onClick={nextSlide}>
          {currentSlide === slides.length - 1 ? "Start Quiz" : "Next"}
        </Button>
      </div>
    </div>
  );
};

// Quiz component displaying only the question and choices.
const Quiz = ({ questions, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setEarnedPoints(earnedPoints + 20);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="p-4">
        <div className="pointer-events-none opacity-50">
          <p className="mb-2 text-base">
            You scored {score} / {questions.length}
          </p>
          <motion.p
            className="text-xl font-bold text-green-500 mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            You earned {earnedPoints} points!
          </motion.p>
        </div>
        <Button size="sm" onClick={() => onComplete(earnedPoints)}>
          Finish Lesson
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          {questions[currentQuestion].question}
        </h3>
        <div className="space-y-3">
          {questions[currentQuestion].options.map(
            (option: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start ${
                    selectedAnswer === index
                      ? selectedAnswer ===
                        questions[currentQuestion].correctAnswer
                        ? "bg-green-100 border-green-500"
                        : "bg-red-100 border-red-500"
                      : ""
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              </motion.div>
            )
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {questions.length}
          </span>
          <Button
            size="sm"
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
          </Button>
        </div>
        {showFeedback &&
          selectedAnswer === questions[currentQuestion].correctAnswer && (
            <motion.p
              className="mt-3 text-center font-bold text-green-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              +20 points!
            </motion.p>
          )}
      </div>
    </div>
  );
};

const ModuleCard = ({
  module,
  sidebarWidth,
}: ModuleCardProps & { sidebarWidth: string }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonStage, setLessonStage] = useState<
    "initial" | "slideshow" | "quiz" | "complete"
  >("initial");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useProgress("progress");
  const { addPoints } = usePoints();

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setLessonStage("slideshow");
    setIsDialogOpen(true);
  };

  const handleQuizComplete = (earned: number) => {
    addPoints(earned);
    setProgress((prev) => {
      const moduleLessons = prev.completedLessons[module.title] || [];
      const updatedLessons =
        activeLesson && !moduleLessons.includes(activeLesson.title)
          ? [...moduleLessons, activeLesson.title]
          : moduleLessons;
      return {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [module.title]: updatedLessons,
        },
      };
    });
    resetLesson();
  };

  const resetLesson = () => {
    setActiveLesson(null);
    setLessonStage("initial");
    setIsDialogOpen(false);
  };

  // Set the dialog height based on the lesson stage.
  const dialogHeight = lessonStage === "quiz" ? "h-[55vh]" : "h-[60vh]";

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className={`${module.color} text-white p-4`}>
          <CardTitle className="flex items-center text-lg font-semibold">
            <module.icon className="w-6 h-6 mr-2" />
            {module.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {module.description}
          </p>
          <Button
            variant="outline"
            className="w-full group"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide Lessons" : "View Lessons"}
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 ml-2 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-2 transition-transform" />
            )}
          </Button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                {module.lessons.map((lesson, index) => {
                  const moduleCompleted =
                    progress.completedLessons[module.title] || [];
                  const isCompleted = moduleCompleted.includes(lesson.title);
                  const isUnlocked =
                    index === 0 ||
                    moduleCompleted.includes(module.lessons[index - 1].title);
                  const isLocked = !isUnlocked || isCompleted;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LessonItem
                        lesson={{ ...lesson, locked: isLocked }}
                        onClick={() => {
                          if (!isLocked) startLesson(lesson);
                        }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={`sm:max-w-[800px] ${dialogHeight} overflow-y-auto fixed top-1/2 left-1/2 transform -translate-y-1/2`}
          style={{
            width: `calc(100% - ${sidebarWidth} - 2rem)`,
            maxWidth: "800px",
            marginLeft: `calc(${sidebarWidth} / 2)`,
            transform: "translate(-50%, -50%)",
          }}
          aria-describedby="lesson-content"
        >
          {lessonStage === "slideshow" && activeLesson && (
            <Slideshow
              slides={activeLesson.slides}
              onComplete={() => setLessonStage("quiz")}
            />
          )}
          {lessonStage === "quiz" && activeLesson && (
            <Quiz
              questions={activeLesson.quizQuestions}
              onComplete={handleQuizComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function LearnContent() {
  const [sidebarWidth, setSidebarWidth] = useState("16rem");

  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      if (sidebar) {
        const width = window.getComputedStyle(sidebar).width;
        setSidebarWidth(width);
      }
    };

    updateSidebarWidth();
    window.addEventListener("resize", updateSidebarWidth);

    const observer = new MutationObserver(updateSidebarWidth);
    const sidebar = document.querySelector('[data-sidebar="sidebar"]');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }

    return () => {
      window.removeEventListener("resize", updateSidebarWidth);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="px-4 py-6 sm:px-6 lg:px-8"
      style={{ "--sidebar-width": sidebarWidth } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-6">
          Weekly Financial Learning Modules
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {modules.map((module) => (
            <motion.div key={module.title} variants={itemVariants}>
              <ModuleCard module={module} sidebarWidth={sidebarWidth} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
