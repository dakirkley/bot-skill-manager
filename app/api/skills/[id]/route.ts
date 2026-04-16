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
    const skill = await prisma.skill.findUnique({
      where: { id },
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
      }
    })

    if (!skill) {
      return new NextResponse("Skill not found", { status: 404 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error("Error fetching skill:", error)
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
    const { name, description, version, installPath, documentationUrl, commands, apiIds } = json

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        description,
        version,
        installPath,
        documentationUrl,
        commands: commands ? JSON.stringify(commands) : null,
      }
    })

    if (apiIds !== undefined) {
      await prisma.skillApi.deleteMany({
        where: { skillId: id }
      })

      if (apiIds.length > 0) {
        await prisma.skillApi.createMany({
          data: apiIds.map((apiId: string) => ({
            skillId: id,
            apiCredentialId: apiId,
            required: true
          }))
        })
      }
    }

    const skillWithRelations = await prisma.skill.findUnique({
      where: { id },
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
      }
    })

    return NextResponse.json(skillWithRelations)
  } catch (error) {
    console.error("Error updating skill:", error)
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
    await prisma.skill.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting skill:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
