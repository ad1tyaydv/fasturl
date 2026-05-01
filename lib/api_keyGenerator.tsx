import crypto from "crypto";

export default function Api_keyGenerator() {

    return (
        "sk_fasturl_" + crypto.randomBytes(32).toString("hex")
    )
}