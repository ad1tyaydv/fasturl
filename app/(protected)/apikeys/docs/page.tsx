"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN;

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group bg-secondary/50 border border-border rounded-lg overflow-hidden mb-4 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
                <span className="text-xs text-muted-foreground font-mono">{language}</span>
                <button
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 text-xs"
                >
                    {copied ? (
                        <>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="px-4 py-4 overflow-x-auto text-sm">
                <code className="text-foreground/90 font-mono whitespace-pre">{code}</code>
            </pre>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-10 font-one">
            <h3 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-border">
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function DocsTab() {
    return (
        <div className="animate-in fade-in duration-300 font-one">
            <div className="mb-8 hidden sm:block">
                <h2 className="text-2xl font-bold text-foreground mb-1">Docs</h2>
                <p className="text-muted-foreground text-sm">
                    Learn how to authenticate and use the API in your applications.
                </p>
            </div>

            <Section title="Authentication">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Use your API key in the <code className="text-primary font-bold">Authorization</code> header as a Bearer token.
                </p>
                <CodeBlock
                    language="bash"
                    code={`curl ${BASE_URL}/app/v1/shortLink \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                />
            </Section>

            <Section title="Base URL">
                <CodeBlock language="text" code={`${BASE_URL}/api/v1/shortLink`} />
            </Section>

            <Section title="Create Short Link">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Create a new short link with optional password, expiry, and custom name.
                </p>

                <CodeBlock
                    language="bash"
                    code={`curl -X POST ${BASE_URL}/api/v1/shortLink \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "url": "https://google.com",
  "linkName": "Google Homepage",
  "password": "123456",
  "expiry": "2026-05-01"
}'`}
                />

                <CodeBlock
                    language="javascript"
                    code={`const res = await fetch("${BASE_URL}/api/v1/shortLink", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://google.com",
    linkName: "Google Homepage",
    password: "123456",
    expiry: "2026-05-01"
  }),
});

const data = await res.json();`}
                />
            </Section>

            <Section title="Response Format">
                <CodeBlock
                    language="json"
                    code={`{
  "shortUrl": "${BASE_URL}/abc123"
}`}
                />
            </Section>

            <Section title="Error Handling">
                <CodeBlock
                    language="json"
                    code={`{
  "message": "Invalid api key"
}`}
                />
            </Section>

            <Section title="Rate Limits">
                <p className="text-muted-foreground text-sm">
                    Each API key has a usage limit. When exceeded, API returns <code className="text-amber-600 dark:text-amber-400 font-bold">429</code>.
                </p>
            </Section>
        </div>
    );
}