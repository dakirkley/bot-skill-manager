
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const totalBots = await prisma.bot.count()
    const totalSkills = await prisma.skill.count()
    const totalCredentials = await prisma.apiCredential.count()
    const activeBots = await prisma.bot.count({
      where: { status: "active" }
    })

    const recentBots = await prisma.bot.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        botSkills: {
          include: {
            skill: true
          }
        }
      }
    })

    const skillsByBot = await prisma.botSkill.groupBy({
      by: ['skillId'],
      _count: {
        botId: true
      }
    })

    const topSkills = await prisma.skill.findMany({
      where: {
        id: {
          in: skillsByBot.map(s => s.skillId)
        }
      },
      take: 5
    })

    return NextResponse.json({
      stats: {
        totalBots,
        totalSkills,
        totalCredentials,
        activeBots
      },
      recentBots,
      topSkills: topSkills.map(skill => ({
        ...skill,
        botCount: skillsByBot.find(s => s.skillId === skill.id)?._count.botId || 0
      }))
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
