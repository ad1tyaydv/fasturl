import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import { Resolver } from "dns/promises";

export async function POST(req: NextRequest) {

    try {
        const { domain: fullDomain } = await req.json();
        const parts = fullDomain.split(".");
        const subDomain = parts.length > 2 ? parts.slice(0, -2).join(".") : null;
        const rootDomain = parts.slice(-2).join(".");

        console.log("fullDomain:", fullDomain);
        console.log("rootDomain:", rootDomain);
        console.log("subDomain:", subDomain);

        const domainData = await prisma.customDomain.findFirst({
            where: { domain: rootDomain, subDomain: subDomain }
        });
        console.log("domainData:", domainData);



        if (!domainData) {
            return NextResponse.json(
                { message: "Domain not found" },
                { status: 404 }
            );
        }

        if (!domainData.txtValue) {
            return NextResponse.json(
                { message: "TXT verification token missing" },
                { status: 400 }
            );
        }

        console.log("Checking domain:", fullDomain);
        console.log("Looking for token:", domainData.txtValue);

        const resolver = new Resolver();
        resolver.setServers(["1.1.1.1", "8.8.8.8"]);

        let isTxtValid = false;
        let txtRecords: string[] = [];

        try {

            console.log("Checking TXT for:", domainData.domain);
            
            const records = await resolver.resolveTxt(domainData.domain);

            console.log("Actual DNS Records found:", JSON.stringify(records));

            txtRecords = records.flat();

            isTxtValid = txtRecords.some((txt) =>
                txt.includes(domainData.txtValue!)
            );

            console.log("TXT records:", txtRecords);
            console.log("TXT match found?", isTxtValid);

            await prisma.customDomain.update({
                where: {
                    domain_subDomain: {
                        domain: rootDomain,
                        subDomain: subDomain
                    }
                },
                data: {
                    txtVerified: isTxtValid
                }
            });

        } catch (error) {

            console.log("TXT lookup error:", error);
            isTxtValid = false;

            await prisma.customDomain.update({
                where: {
                    domain_subDomain: {
                        domain: rootDomain,
                        subDomain: subDomain
                    }
                },
                data: {
                    txtVerified: false
                }
            });

        }

        // If TXT verified → Activate Domain
        if (isTxtValid) {

            await prisma.customDomain.update({
                where: {
                    domain_subDomain: {
                        domain: rootDomain,
                        subDomain: subDomain
                    }
                },
                data: {
                    isActive: true
                }
            });

            console.log("Domain verified successfully");

            return NextResponse.json(
                {
                    message: "Domain verified successfully",
                    verified: true
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                message: "Domain not verified yet",
                verified: false
            },
            { status: 429 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error while verifying domain" },
            { status: 500 }
        );
    }
}