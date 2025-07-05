"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ZapIcon, TrendingUpIcon, UsersIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  stat: string
  description: string
  icon?: React.ReactNode
  trend?: string
}

function StatsCard({ title, stat, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <Badge variant="secondary" className="mt-2">
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureProps {
  title: string
  text: string
  icon: React.ReactNode
}

function Feature({ title, text, icon }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export default function EnhancedStats() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Enhanced Stats</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We've reimagined the way you track your progress, making it more intuitive and insightful than ever before.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Daily Reach"
          stat="5,000,000"
          description="Daily unique visitors"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          trend="+12.5%"
        />
        <StatsCard
          title="New Users"
          stat="500,000"
          description="New users per month"
          icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
          trend="+8.2%"
        />
        <StatsCard
          title="Active Sessions"
          stat="2,500,000"
          description="Concurrent active sessions"
          icon={<ZapIcon className="h-4 w-4 text-muted-foreground" />}
          trend="+15.3%"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-3 mt-12">
        <Feature
          title="Instant Activation"
          icon={<ZapIcon className="h-6 w-6 text-primary" />}
          text="Get up and running in seconds with our streamlined activation process."
        />
        <Feature
          title="Dynamic Insights"
          icon={<TrendingUpIcon className="h-6 w-6 text-primary" />}
          text="Unlock the power of real-time data and make informed decisions with our dynamic insights."
        />
        <Feature
          title="Seamless Integration"
          icon={<UsersIcon className="h-6 w-6 text-primary" />}
          text="Integrate effortlessly with your existing tools and workflows for a seamless experience."
        />
      </div>
    </div>
  )
}
