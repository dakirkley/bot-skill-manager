
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const credential = await prisma.apiCredential.findUnique({
      where: { id: params.id },
      include: {
        skillApis: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!credential) {
      return new NextResponse("Credential not found", { status: 404 })
    }

    return NextResponse.json(credential)
  } catch (error) {
    console.error("Error fetching credential:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const json = await request.json()
    const { name, service, keyIdentifier, expirationDate, status, notes } = json

    const credential = await prisma.apiCredential.update({
      where: { id: params.id },
      data: {
        name,
        service,
        keyIdentifier,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        status,
        notes
      }
    })

    return NextResponse.json(credential)
  } catch (error) {
    console.error("Error updating credential:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.apiCredential.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting credential:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
