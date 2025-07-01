"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, FileText, Flag, BarChart3, Shield, Eye, ThumbsUp, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { RBACService, type UserRole } from "@/lib/rbac"
import { ContentService, type ContentItem } from "@/lib/content-management"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole>("user")
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    flaggedContent: 0,
    activeReports: 0,
  })

  useEffect(() => {
    if (user) {
      loadAdminData()
    }
  }, [user])

  const loadAdminData = async () => {
    try {
      if (!user) return

      // Check user role
      const role = await RBACService.getUserRole(user.uid)
      setUserRole(role)

      // Load content for moderation
      const allContent = await ContentService.getContent({ limit: 50 })
      setContent(allContent)

      // Calculate stats
      setStats({
        totalUsers: 1250, // In production, fetch from analytics
        totalContent: allContent.length,
        flaggedContent: allContent.filter((c) => c.status === "flagged").length,
        activeReports: 23, // In production, fetch from reports collection
      })

      setLoading(false)
    } catch (error) {
      console.error("❌ Error loading admin data:", error)
      setLoading(false)
    }
  }

  const handleModerateContent = async (contentId: string, action: "approve" | "flag" | "archive") => {
    try {
      if (!user) return

      await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          moderatorId: user.uid,
          action,
          notes: `Moderated by ${user.displayName}`,
        }),
      })

      // Reload content
      await loadAdminData()
    } catch (error) {
      console.error("❌ Error moderating content:", error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading admin dashboard...</div>
  }

  if (!["moderator", "admin", "super_admin"].includes(userRole)) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Role: <Badge variant="secondary">{userRole}</Badge>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Total Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">Guides, tutorials, news</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flag className="h-4 w-4 mr-2" />
              Flagged Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.flaggedContent}</div>
            <p className="text-xs text-muted-foreground">Requires moderation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Active Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.activeReports}</div>
            <p className="text-xs text-muted-foreground">User reports pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Content Moderation</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search content..." className="max-w-sm" />
          </div>

          <div className="space-y-4">
            {content.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge
                          variant={
                            item.status === "published"
                              ? "default"
                              : item.status === "flagged"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        By {item.authorName} • {item.createdAt.toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-3">{item.content.substring(0, 150)}...</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {item.views}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {item.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {item.status !== "published" && (
                        <Button size="sm" onClick={() => handleModerateContent(item.id, "approve")}>
                          Approve
                        </Button>
                      )}
                      {item.status !== "flagged" && (
                        <Button size="sm" variant="destructive" onClick={() => handleModerateContent(item.id, "flag")}>
                          Flag
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleModerateContent(item.id, "archive")}>
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-muted-foreground">User role management and account controls coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center py-12">
            <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">User Reports</h3>
            <p className="text-muted-foreground">Content and user report management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Detailed analytics and insights coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
