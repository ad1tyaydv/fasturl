// import { prisma } from "@/lib/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import jwt from "jsonwebtoken";


// const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

// export async function POST(req: NextRequest) {

//     try {
//         const token = req.cookies.get("token")?.value;

//         if(!token) {
//             return NextResponse.json(
//                 {message: "User not found"},
//                 {status: 404}
//             )
//         }
//         const decoded = jwt.verify(token, JWT_SECRET) as {
//             userId: string;
//         };

//         const { domain: fullDomain } = await req.json();

//         const parts = fullDomain.split(".");
//         if (parts.length < 2) {
//             return NextResponse.json(
//                 { message: "Invalid domain format" },
//                 { status: 400 }
//             );
//         }

//         const subDomain = parts.length > 2 ? parts.slice(0, parts.length - 2).join(".") : null;
//         const rootDomain = parts.slice(-2).join(".");

//         const existing = await prisma.customDomain.findFirst({
//             where: {
//                 domain: rootDomain,
//                 subDomain: subDomain
//             }
//         });

//         if (existing) {
//             return NextResponse.json({
//                 success: true,
//                 verificationToken: existing.txtValue,
//                 cnameTarget: existing.cnameTarget,
//                 domain: existing.domain,
//                 subDomain: existing.subDomain
//             });
//         }

//         const txtValue = 
//             await fetch(
//                 `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
//                 {
//                     method: "POST",
//                     headers: {
//                         Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         name: fullDomain
//                     }),
//                 }
//             );  

//         const vercelData = await txtValue.json();
//         console.log("Vercel response:", JSON.stringify(vercelData));

//         const verificationToken = vercelData?.verification?.[0]?.value || null;
//         const txtName = vercelData?.verification?.[0]?.domain || null;
        

//         const newDomain = await prisma.customDomain.create({
//             data: {
//                 domain: rootDomain,
//                 subDomain: subDomain,
//                 txtValue: verificationToken,
//                 txtName: txtName,
//                 txtVerified: false,
//                 cnameTarget: "557578e1dbbfc52a.vercel-dns-017.com",
//                 cnameVerfied: false,
//                 isActive: false,
//                 userId: decoded.userId,
//             }
//         })

//         return NextResponse.json({
//             success: true,
//             verificationToken: newDomain.txtValue,
//             cnameTarget: newDomain.cnameTarget,
//             domain: newDomain.domain,
//             subDomain: newDomain.subDomain
//         });

//     } catch (error) {
//         console.log(error);
//         return NextResponse.json(
//             {message: "Errow while adding domain"},
//             {status: 500}
//         );
//     }
// }

import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { parse } from "tldts";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const { domain: fullDomain } = await req.json();

    if (!fullDomain) {
      return NextResponse.json(
        { message: "Domain required" },
        { status: 400 }
      );
    }

    // Better domain parsing
    const parsed = parse(fullDomain);

    if (!parsed.domain) {
      return NextResponse.json(
        { message: "Invalid domain format" },
        { status: 400 }
      );
    }

    const rootDomain = parsed.domain;
    const subDomain = parsed.subdomain || null;

    // Check existing
    const existing = await prisma.customDomain.findFirst({
      where: {
        domain: rootDomain,
        subDomain: subDomain
      }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        verificationToken: existing.txtValue,
        cnameTarget: existing.cnameTarget,
        domain: existing.domain,
        subDomain: existing.subDomain
      });
    }

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const txtName = `_vercel.${fullDomain}`;

    const cnameTarget = `${process.env.VERCEL_PROJECT_ID}.vercel-dns.com`;

    const newDomain = await prisma.customDomain.create({
      data: {
        domain: rootDomain,
        subDomain: subDomain,
        txtValue: verificationToken,
        txtName: txtName,
        txtVerified: false,
        cnameTarget: cnameTarget,
        cnameVerfied: false,
        isActive: false,
        userId: decoded.userId
      }
    });

    return NextResponse.json({
      success: true,
      verificationToken: newDomain.txtValue,
      txtName: newDomain.txtName,
      cnameTarget: newDomain.cnameTarget,
      domain: newDomain.domain,
      subDomain: newDomain.subDomain
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Error while adding domain" },
      { status: 500 }
    );
  }
}