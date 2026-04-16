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

            const txtHost = `${domainData.txtName}.${domainData.domain}`;

            console.log("Checking TXT for:", txtHost);

            const records = await resolver.resolveTxt(txtHost);
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


        let isCnameValid = false;
        let cnameRecords: string[] = [];

        try {

            const cnameHost = subDomain ? `${subDomain}.${rootDomain}` : rootDomain;

            console.log("Checking CNAME for:", cnameHost);

            const records = await resolver.resolveCname(cnameHost);

            console.log("CNAME Records:", records);

            cnameRecords = records;

            isCnameValid = cnameRecords.includes(domainData.cnameTarget!);

            console.log("CNAME match found?", isCnameValid);

            await prisma.customDomain.update({
                where: {
                    domain_subDomain: {
                        domain: rootDomain,
                        subDomain: subDomain
                    }
                },
                data: {
                    cnameVerfied: isCnameValid
                }
            });

        } catch (error) {

            console.log("CNAME lookup error:", error);

            await prisma.customDomain.update({
                where: {
                    domain_subDomain: {
                        domain: rootDomain,
                        subDomain: subDomain
                    }
                },
                data: {
                    cnameVerfied: false
                }
            });

        }

        if (isTxtValid && isCnameValid) {

            try {

                const response = await fetch(
                    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: fullDomain
                        }),
                    }
                );

                const data = await response.json();

                console.log("Vercel domain response:", data);

            } catch (error) {
                console.log("Error adding domain to Vercel:", error);
            }

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