import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserPlus, Trophy, TrendingUp, Target, Search, FileText, DollarSign } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChevronRight, FlameIcon as Fire, Star } from "lucide-react";


function ProfileCard() {
  return (
    <Card className="max-w-3xl mx-auto bg-white dark:bg-[#111111] border-gray-200 dark:border-[#222222] mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="relative w-24 h-24">
              <Image
                src="/avatar.png?height=96&width=96"
                alt="Profile Picture"
                layout="fill"
                className="rounded-lg object-cover border border-gray-300 dark:border-[#333333]"
              />
            </div>
            <Badge className="absolute -top-2 -right-2 bg-gray-100 dark:bg-[#222222] text-gray-800 dark:text-white border-gray-300 dark:border-[#333333] px-2 py-1">
              Level 5
            </Badge>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">Jane Investor</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Financial Strategy Expert</p>
              </div>
              <Button
                variant="outline"
                className="bg-white dark:bg-[#222222] border-gray-300 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#333333] text-gray-800 dark:text-white"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friend
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-[#222222]">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs">Ranking</span>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">Top 10%</p>
              </div>

              <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-[#222222]">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Fire className="h-4 w-4 text-orange-500" />
                    <span className="text-xs">Daily Streak</span>
                  </div>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">7 days</p>
              </div>

              <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-[#222222]">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs">Completed</span>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">15 Quests</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CompanySearch() {
    const companies = [
        { name: "Apple Inc.", symbol: "AAPL", trend: "up", change: "+2.3%", image: "apple.png" },
        { name: "Microsoft", symbol: "MSFT", trend: "up", change: "+1.8%", image: "microsoft.png" },
        { name: "Tesla", symbol: "TSLA", trend: "down", change: "-0.7%", image: "tesla.png" },
        { name: "Amazon", symbol: "AMZN", trend: "up", change: "+1.2%", image: "amazon.png" },
      ]

  return (
    <Card className="max-w-3xl mx-auto bg-white dark:bg-[#111111] border-gray-200 dark:border-[#222222]">
      <CardHeader className="p-6 pb-0">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company Analysis</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Search for financial documents</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search by company name or symbol..."
            className="pl-10 bg-white dark:bg-[#1A1A1A] border-gray-300 dark:border-[#333333] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-12"
          />
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Popular Companies</h4>
          <div className="grid grid-cols-2 gap-4">
            {companies.map((company) => (
              <button
                key={company.symbol}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg border border-gray-200 dark:border-[#222222] hover:bg-gray-100 dark:hover:bg-[#222222] transition-colors"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-300 dark:border-[#333333]">
                  <Image
                    src={`/${company.image}?height=40&width=40&text=${company.symbol}`}
                    alt={company.name}
                    layout="fill"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{company.name}</p>
                    <span
                      className={`text-xs ${company.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {company.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{company.symbol}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Button
            variant="outline"
            className="bg-white dark:bg-[#1A1A1A] border-gray-300 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#222222] text-gray-800 dark:text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Balance Sheet
          </Button>
          <Button
            variant="outline"
            className="bg-white dark:bg-[#1A1A1A] border-gray-300 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#222222] text-gray-800 dark:text-white"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Income Statement
          </Button>
          <Button
            variant="outline"
            className="bg-white dark:bg-[#1A1A1A] border-gray-300 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#222222] text-gray-800 dark:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Cash Flow
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen text-gray-900 dark:text-white p-6">
      <ProfileCard />
      <CompanySearch />
    </div>
  )
}





  
  