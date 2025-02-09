"use client";

import QuizBattle from "@/components/kokonutui/quiz-battle";
import Layout from "@/components/kokonutui/layout";
import Question from "@/components/kokonutui/question";
import { questions } from "@/lib/utils";
import BattleIndicator from "@/components/kokonutui/battle-indicator";

const BattlePage = () => {
  return (
    <Layout>
      <QuizBattle />
    </Layout>
  );
};

export default BattlePage;
