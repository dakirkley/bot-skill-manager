
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const service = searchParams.get("service")

  try {
    const where: any = {}

    if (service) {
      where.service = service
    }

    const credentials = await prisma.apiCredential.findMany({
      where,
      include: {
        skillApis: {
          include: {
            skill: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(credentials)
  } catch (error) {
    console.error("Error fetching credentials:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const json = await request.json()
    const { name, service, keyIdentifier, expirationDate, status, notes } = json

    const credential = await prisma.apiCredential.create({
      data: {
        name,
        service,
        keyIdentifier,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        status: status || "active",
        notes
      }
    })

    return NextResponse.json(credential)
  } catch (error) {
    console.error("Error creating credential:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
