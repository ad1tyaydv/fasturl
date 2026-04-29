import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token!, JWT_SECRET) as {
            userId: string;
            email: string;
        }
        const userId = decoded.userId;

        const data = await req.json();

        const find = await prisma.link.findUnique({
            where: {
                id: data.linkId
            }
        })

        if (!find) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 404 }
            )
        }

        if (find.checkBulk === true) {
            await redis.del(`fetchBulkLinks:${userId}`);

            const addLinkName = await prisma.link.update({
                where: {
                    id: data.linkId
                },
                data: {
                    linkName: data.name
                }
            })

            return NextResponse.json(
                { message: "Link name added successfully" },
                { status: 200 }
            )

        } else {
            await redis.del(`fetchLinks:${userId}`)
            await redis.del(`analytics${find.shorturl}`)

            const addLinkName = await prisma.link.update({
                where: {
                    id: data.linkId
                },
                data: {
                    linkName: data.name
                }
            })

            return NextResponse.json(
                { message: "Link name added successfully" },
                { status: 200 }
            )
        }

    } catch (error) {
        return NextResponse.json(
            { message: "Error while adding link name" },
            { status: 500 }
        )
    }
}