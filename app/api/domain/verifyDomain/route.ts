import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import { Resolver } from "dns/promises";


export async function POST(req: NextRequest) {
    const {domain} = await req.json();

    try {
        const domainData = await prisma.customDomain.findUnique({
            where: {domain}
        });

        if (!domainData) {
            return NextResponse.json(
                {message: "Domain not found"},
                {status: 404}
            );
        }

        if (!domainData.txtValue || !domainData.subDomain || !domainData.cnameTarget) {
            return NextResponse.json(
                { message: "TXT token, subdomain, or CNAME target missing" },
                { status: 400 }
            );
        }
        console.log("Checking domain:", domain);
        console.log("Looking for token:", domainData.txtValue);


        const resolver = new Resolver();
        resolver.setServers(["1.1.1.1", "8.8.8.8"]);

        let isTxtValid = false;
        try {
            const txtRecords = await resolver.resolveTxt(domainData.domain);
            console.log("Actual DNS Records found:", JSON.stringify(txtRecords));

            const flatRecords = txtRecords.flat();
            isTxtValid = flatRecords.some(txt => txt.includes(domainData.txtValue!));
            console.log("Match found?", isTxtValid);

            await prisma.customDomain.update({
                where: {
                    domain: domain
                },
                data: { 
                    txtVerified: isTxtValid
                }
            });

            console.log("TXT records:", flatRecords);
            console.log("TXT match found?", isTxtValid);

        } catch (error) {
            isTxtValid = false;
        }


        let isCnameValid = false;
        let cnameRecords: string[] = [];

        try {
            const fullSubDomain = `${domainData.subDomain}.${domainData.domain}`;
            cnameRecords = await resolver.resolveCname(fullSubDomain);

            isCnameValid = cnameRecords.some((record) =>
                record.includes(domainData.cnameTarget!)
            );

            await prisma.customDomain.update({
                where: {
                    domain
                },
                data: {
                    cnameVerfied: isCnameValid
                },
            });

            console.log("CNAME records:", cnameRecords);
            console.log("CNAME match found?", isCnameValid);


        } catch (error) {
            console.log("CNAME error:", error);
            isCnameValid = false;
        }


        console.log("Expected CNAME:", domainData.cnameTarget);
        console.log("CNAME Found:", cnameRecords);


        if(isTxtValid && isCnameValid) {

            await prisma.customDomain.update({
                where: {
                    domain: domain
                },
                data: {
                    isActive: true
                }
            })

            return NextResponse.json(
                {message: "Domain verified successfully", verified: true},
                {status: 200}
            );

        } else {
            return NextResponse.json(
                {message: "Domain verified successfully", verified: false},
                {status: 200}
            );
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Error while verifying domain"},
            {status: 500}
        );
    }
}