
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status")
  const skillId = searchParams.get("skillId")

  try {
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (skillId) {
      where.botSkills = {
        some: {
          skillId: skillId
        }
      }
    }

    const bots = await prisma.bot.findMany({
      where,
      include: {
        botSkills: {
          include: {
            skill: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(bots)
  } catch (error) {
    console.error("Error fetching bots:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const json = await request.json()
    const { name, description, status, skillIds } = json

    const bot = await prisma.bot.create({
      data: {
        name,
        description,
        status: status || "active",
      }
    })

    if (skillIds && skillIds.length > 0) {
      await prisma.botSkill.createMany({
        data: skillIds.map((skillId: string) => ({
          botId: bot.id,
          skillId
        }))
      })
    }

    const botWithSkills = await prisma.bot.findUnique({
      where: { id: bot.id },
      include: {
        botSkills: {
          include: {
            skill: true
          }
        }
      }
    })

    return NextResponse.json(botWithSkills)
  } catch (error) {
    console.error("Error creating bot:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
