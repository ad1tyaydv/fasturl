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

        if (!domainData.token) {
            return NextResponse.json(
                {message: "TXT token is not found"},
                {status: 404}
            );
        }
        console.log("Checking domain:", domain);
        console.log("Looking for token:", domainData.token);


        const resolver = new Resolver();
        resolver.setServers(["1.1.1.1", "8.8.8.8"]);
        let isValid = false;

        try {
            const records = await resolver.resolveTxt(domain);
            console.log("Actual DNS Records found:", JSON.stringify(records));

            const flatRecords = records.flat();
            isValid = flatRecords.some(txt => txt.includes(domainData.token!));
            console.log("Match found?", isValid);

        } catch (error) {
            isValid = false;
        }

        await prisma.customDomain.update({
            where: {
                domain: domain
            },
            data: { 
                verified: isValid
             }
        });

        if (isValid) {
            return NextResponse.json(
                {message: "Domain verified successfully", verified: true},
                {status: 200}
            );
        } else {
            return NextResponse.json(
                {message: "Verification failed. DNS records not found yet.", verified: false},
                {status: 400}
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