"use client";

import type React from "react";
import Layout from "@/components/kokonutui/layout";
import {
  ShoppingBag,
  Clock,
  Zap,
  Brain,
  Target,
  Shield,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Powerup {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ElementType;
  color: string;
}

const powerups: Powerup[] = [
  {
    id: "1",
    name: "Time Freeze",
    description:
      "Pause the timer for 10 seconds, giving you extra time to answer.",
    price: 500,
    icon: Clock,
    color: "text-blue-500",
  },
  {
    id: "2",
    name: "Double Points",
    description: "Double the points for your next correct answer.",
    price: 1000,
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    id: "3",
    name: "Brain Boost",
    description: "Receive a hint for the current question.",
    price: 750,
    icon: Brain,
    color: "text-purple-500",
  },
  {
    id: "4",
    name: "Precision Strike",
    description: "Eliminate one incorrect answer option.",
    price: 600,
    icon: Target,
    color: "text-red-500",
  },
  {
    id: "5",
    name: "Answer Shield",
    description:
      "Protect yourself from losing points on your next incorrect answer.",
    price: 1500,
    icon: Shield,
    color: "text-green-500",
  },
  {
    id: "6",
    name: "Quick Draw",
    description: "Get a 2-second head start on seeing the next question.",
    price: 2500,
    icon: Rocket,
    color: "text-orange-500",
  },
];

export default function ShopPage() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingBag className="mr-2 h-8 w-8" />
          Quiz Game Powerups Shop
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {powerups.map((powerup, index) => (
            <motion.div
              key={powerup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{powerup.name}</h2>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <powerup.icon className={`h-8 w-8 ${powerup.color}`} />
                    </motion.div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {powerup.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {powerup.price} points
                    </span>
                    <Button className="px-4 py-2 transition-all duration-300 hover:bg-opacity-80">
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
}
