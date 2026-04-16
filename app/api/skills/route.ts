
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
  const apiId = searchParams.get("apiId")

  try {
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (apiId) {
      where.skillApis = {
        some: {
          apiCredentialId: apiId
        }
      }
    }

    const skills = await prisma.skill.findMany({
      where,
      include: {
        botSkills: {
          include: {
            bot: true
          }
        },
        skillApis: {
          include: {
            apiCredential: true
          }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching skills:", error)
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
    const { name, description, version, installPath, documentationUrl, commands, apiIds } = json

    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        version: version || "1.0.0",
        installPath,
        documentationUrl,
        commands: commands ? JSON.stringify(commands) : null,
      }
    })

    if (apiIds && apiIds.length > 0) {
      await prisma.skillApi.createMany({
        data: apiIds.map((apiId: string) => ({
          skillId: skill.id,
          apiCredentialId: apiId,
          required: true
        }))
      })
    }

    const skillWithRelations = await prisma.skill.findUnique({
      where: { id: skill.id },
      include: {
        botSkills: true,
        skillApis: {
          include: {
            apiCredential: true
          }
        }
      }
    })

    return NextResponse.json(skillWithRelations)
  } catch (error) {
    console.error("Error creating skill:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
