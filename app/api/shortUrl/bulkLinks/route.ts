import { NextRequest, NextResponse } from "next/server";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

const chunkArray = (array: any[], size: number) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Token not found" }, { status: 404 });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as {
    userId: string;
    email: string;
  };

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const pass = formData.get("password") as string | null;
    const password = pass?.trim() || null;
    let hashedPassword: string | null = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const expiryDate = formData.get("expiryDate") as string | null;
    const expiresAt =
      expiryDate && expiryDate.trim() !== "" ? new Date(expiryDate) : null;

    if (expiresAt && isNaN(expiresAt.getTime())) {
      return NextResponse.json({ message: "Invalid expiry date" }, { status: 400 });
    }

    const text = await file.text();
    const rawLines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    const dataLines = rawLines.slice(1);

    const validLinks = dataLines
      .map(line => {
        const [url, customUrl] = line
          .split(",")
          .map(part => part?.trim().replace(/^["']|["']$/g, ""));

        return {
          url,
          customUrl: customUrl || null,
        };
      })

    const totalRequestedLinks = validLinks.length;

    if (totalRequestedLinks === 0) {
      return NextResponse.json(
        { message: "No valid links found in CSV" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        totalLinks: true,
        linksUsed: true,
        plan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (
      (user.plan === "ESSENTIAL" || user.plan === "PRO") &&
      totalRequestedLinks > 5000
    ) {
      return NextResponse.json(
        { message: "Max 5000 links per upload" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        if (user.totalLinks - user.linksUsed < totalRequestedLinks) {
          throw new Error("LIMIT_EXCEEDED");
        }

        let LinksToInsert = validLinks.map(link => ({
          userId: decoded.userId,
          original: link.url,
          shorturl: link.customUrl || shortUrlGenerator(),
          password: hashedPassword,
          isProtected: !!hashedPassword,
          expiresAt,
        }));

        const existing = await tx.link.findMany({
          where: {
            shorturl: {
              in: LinksToInsert.map(l => l.shorturl),
            },
          },
          select: { shorturl: true },
        });

        const existingSet = new Set(existing.map(e => e.shorturl));

        let replacedCount = 0;
        LinksToInsert = LinksToInsert.map((link, index) => {
          if (existingSet.has(link.shorturl)) {
            if (validLinks[index].customUrl) {
              replacedCount++;
            }
            return {
              ...link,
              shorturl: shortUrlGenerator(),
            };
          }
          return link;
        });

        const bulkHeader = await tx.bulkLinks.create({
          data: {
            userId: decoded.userId,
            name: "Untitled Bulk",
            password: hashedPassword,
            expiresAt,
          },
        });

        LinksToInsert = LinksToInsert.map(l => ({
          ...l,
          bulkLinksId: bulkHeader.id,
          checkBulk: true,
        }));

        await redis.del(`fetchBulkLinks:${decoded.userId}`);

        const chunks = chunkArray(LinksToInsert, 2000);

        let createdCount = 0;
        let createdLinks: any[] = [];

        for (const chunk of chunks) {
          const batch = await tx.link.createMany({
            data: chunk,
            skipDuplicates: true,
          });

          if (batch.count > 0) {
            createdLinks.push(...chunk);
          }

          createdCount += batch.count;
        }

        if (createdCount < totalRequestedLinks) {
          const refund = totalRequestedLinks - createdCount;

          await tx.user.update({
            where: { id: decoded.userId },
            data: {
              linksUsed: {
                decrement: refund,
              },
            },
          });
        }

        await tx.user.update({
          where: { id: decoded.userId },
          data: {
            linksUsed: {
              increment: createdCount,
            },
            totalLinksCreated: {
              increment: createdCount,
            },
          },
        });

        return {
          count: createdCount,
          replacedCount,
          links: createdLinks.map(l => ({
            original: l.original,
            shorturl: l.shorturl,
          })),
        };
      },
      {
        timeout: 90000,
        isolationLevel: "Serializable",
      }
    );

    return NextResponse.json({
      success: result.links,
      count: result.count,
      replacedCount: result.replacedCount,
      message: `Successfully created ${result.count} links`,
    });

  } catch (error: any) {
    console.error("BULK_UPLOAD_ERROR:", error);

    if (error.message === "LIMIT_EXCEEDED") {
      return NextResponse.json(
        { message: "Insufficient link quota" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}