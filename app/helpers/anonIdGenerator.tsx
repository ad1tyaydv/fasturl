import { customAlphabet } from "nanoid";

export default function AnonIdGenerator () {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const generateAnonId = customAlphabet(alphabet, 16);

  const anonId = generateAnonId();

  return anonId;
}