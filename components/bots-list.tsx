"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, MoreVertical, Edit, Trash2, Bot } from "lucide-react"
import Link from "next/link"

interface Bot {
  id: string
  name: string
  description: string | null
  status: string
  createdAt: string
  botSkills: {
    skill: {
      id: string
      name: string
    }
  }[]
}

interface Skill {
  id: string
  name: string
}

export function BotsList() {
  const [bots, setBots] = useState<Bot[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    skillIds: [] as string[]
  })

  const fetchBots = async () => {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (statusFilter) params.append("status", statusFilter)

    const res = await fetch(`/api/bots?${params}`)
    const data = await res.json()
    setBots(data)
    setLoading(false)
  }

  const fetchSkills = async () => {
    const res = await fetch("/api/skills")
    const data = await res.json()
    setSkills(data)
  }

  useEffect(() => {
    fetchBots()
    fetchSkills()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(fetchBots, 300)
    return () => clearTimeout(timeout)
  }, [search, statusFilter])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      setIsCreateOpen(false)
      setFormData({ name: "", description: "", status: "active", skillIds: [] })
      fetchBots()
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBot) return
    const res = await fetch(`/api/bots/${selectedBot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      setIsEditOpen(false)
      setSelectedBot(null)
      fetchBots()
    }
  }

  const handleDelete = async () => {
    if (!selectedBot) return
    const res = await fetch(`/api/bots/${selectedBot.id}`, {
      method: "DELETE"
    })
    if (res.ok) {
      setIsDeleteOpen(false)
      setSelectedBot(null)
      fetchBots()
    }
  }

  const openEdit = (bot: Bot) => {
    setSelectedBot(bot)
    setFormData({
      name: bot.name,
      description: bot.description || "",
      status: bot.status,
      skillIds: bot.botSkills?.map(bs => bs.skill.id) || []
    })
    setIsEditOpen(true)
  }

  const openDelete = (bot: Bot) => {
    setSelectedBot(bot)
    setIsDeleteOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search bots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter || undefined} onValueChange={(value: string | null) => setStatusFilter(value || "")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Bot</DialogTitle>
                <DialogDescription>
                  Add a new bot to your fleet.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: string) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                    {skills.map((skill) => (
                      <label key={skill.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.skillIds.includes(skill.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, skillIds: [...formData.skillIds, skill.id] })
                            } else {
                              setFormData({ ...formData, skillIds: formData.skillIds.filter(id => id !== skill.id) })
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm">{skill.name}</span>
                      </label>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-slate-500">No skills available. Create skills first.</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Bot</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bots Grid */}
      {bots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 mb-4">No bots found</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first bot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Card key={bot.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/bots/${bot.id}`} className="hover:underline">
                        {bot.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {bot.description || "No description"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(bot)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDelete(bot)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={bot.status === "active" ? "default" : "secondary"}>
                    {bot.status}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {bot.botSkills?.length || 0} skills
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {bot.botSkills?.slice(0, 3).map((bs) => (
                    <Badge key={bs.skill.id} variant="outline" className="text-xs">
                      {bs.skill.name}
                    </Badge>
                  ))}
                  {bot.botSkills?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bot.botSkills.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Bot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {skills.map((skill) => (
                    <label key={skill.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skillIds.includes(skill.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, skillIds: [...formData.skillIds, skill.id] })
                          } else {
                            setFormData({ ...formData, skillIds: formData.skillIds.filter(id => id !== skill.id) })
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedBot?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
