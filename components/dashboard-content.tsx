"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Wrench, Key, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  stats: {
    totalBots: number
    totalSkills: number
    totalCredentials: number
    activeBots: number
  }
  recentBots: any[]
  topSkills: any[]
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalBots || 0}</div>
            <p className="text-xs text-slate-500">
              {data?.stats.activeBots || 0} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Wrench className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalSkills || 0}</div>
            <p className="text-xs text-slate-500">
              Across all bots
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Credentials</CardTitle>
            <Key className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalCredentials || 0}</div>
            <p className="text-xs text-slate-500">
              Tracked services
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.stats.totalBots
                ? Math.round((data.stats.activeBots / data.stats.totalBots) * 100)
                : 0}%
            </div>
            <p className="text-xs text-slate-500">
              Bots operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bots */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Bots</CardTitle>
            <Link href="/bots">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data?.recentBots?.length === 0 ? (
            <p className="text-sm text-slate-500">No bots yet. Create your first bot to get started.</p>
          ) : (
            <div className="space-y-4">
              {data?.recentBots?.map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{bot.name}</p>
                    <p className="text-sm text-slate-500">
                      {bot.botSkills?.length || 0} skills installed
                    </p>
                  </div>
                  <Badge variant={bot.status === "active" ? "default" : "secondary"}>
                    {bot.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Most Used Skills</CardTitle>
            <Link href="/skills">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data?.topSkills?.length === 0 ? (
            <p className="text-sm text-slate-500">No skills yet. Add skills to see usage stats.</p>
          ) : (
            <div className="space-y-4">
              {data?.topSkills?.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-slate-500">v{skill.version}</p>
                  </div>
                  <Badge variant="outline">{skill.botCount} bots</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
