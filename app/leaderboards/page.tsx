"use client";
import Layout from "@/components/kokonutui/layout";
import { Trophy, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface User {
  username: string;
  points: number;
}

const staticUsers: User[] = [
  { username: "CryptoKing", points: 1250 },
  { username: "InvestorPro", points: 980 },
  { username: "MoneyMaker", points: 875 },
  { username: "FinanceGuru", points: 720 },
  { username: "WallStreetWizard", points: 650 },
  { username: "BudgetMaster", points: 540 },
  { username: "SavingsStar", points: 430 },
  { username: "StockMarketSage", points: 320 },
  { username: "EconomyExpert", points: 210 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function LeaderboardPage() {
  // Use local state to hold your dynamic score.
  const [score, setScore] = useState(1000);

  // Simulate an update to the score (for example, after an API call or user action)
  useEffect(() => {
    const timer = setTimeout(() => {
      setScore(1050); // Update your score dynamically here.
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Create your current user using the dynamic score.
  const currentUser: User = {
    username: "YourUsername",
    points: score,
  };

  // Combine the static users with your current user.
  const users: User[] = [...staticUsers, currentUser];

  // Sort the users by points in descending order.
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <Layout>
      <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-[#2E1A46] dark:text-purple-300 flex items-center justify-center"
          variants={itemVariants}
        >
          <Trophy className="mr-2 h-10 w-10" />
          Leaderboard
        </motion.h1>
        <motion.div
          className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden border border-[#2E1A46] dark:border-purple-700"
          variants={itemVariants}
        >
          <div className="p-6 bg-gradient-to-r from-[#2E1A46] to-purple-700 text-white">
            <h2 className="text-2xl font-semibold mb-2">Top Performers</h2>
            <p className="text-purple-200">
              Compete with the best and climb the ranks!
            </p>
          </div>
          <motion.table className="w-full" variants={containerVariants}>
            <thead className="bg-[#2E1A46] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {sortedUsers.map((user, index) => (
                <motion.tr
                  key={user.username}
                  className={
                    user.username === "YourUsername"
                      ? "bg-purple-100 dark:bg-purple-900"
                      : "hover:bg-gray-50 dark:hover:bg-zinc-700"
                  }
                  variants={itemVariants}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 && (
                        <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                      )}
                      {index === 1 && (
                        <Medal className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      {index === 2 && (
                        <Award className="w-5 h-5 text-yellow-700 mr-2" />
                      )}
                      <motion.span
                        className={`text-sm ${
                          index < 3
                            ? "font-semibold"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        {index + 1}
                      </motion.span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.span
                      className="text-sm font-medium text-gray-900 dark:text-white"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {user.username}
                    </motion.span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.span
                      className="text-sm text-gray-500 dark:text-gray-400"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {user.points}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
