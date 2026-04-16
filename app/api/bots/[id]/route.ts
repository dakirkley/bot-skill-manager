import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { id } = await params

  try {
    const bot = await prisma.bot.findUnique({
      where: { id },
      include: {
        botSkills: {
          include: {
            skill: {
              include: {
                skillApis: {
                  include: {
                    apiCredential: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 })
    }

    return NextResponse.json(bot)
  } catch (error) {
    console.error("Error fetching bot:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { id } = await params

  try {
    const json = await request.json()
    const { name, description, status, skillIds } = json

    const bot = await prisma.bot.update({
      where: { id },
      data: {
        name,
        description,
        status
      }
    })

    if (skillIds !== undefined) {
      await prisma.botSkill.deleteMany({
        where: { botId: id }
      })

      if (skillIds.length > 0) {
        await prisma.botSkill.createMany({
          data: skillIds.map((skillId: string) => ({
            botId: id,
            skillId
          }))
        })
      }
    }

    const botWithSkills = await prisma.bot.findUnique({
      where: { id },
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
    console.error("Error updating bot:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.bot.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
