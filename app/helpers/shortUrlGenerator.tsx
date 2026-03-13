import { customAlphabet } from "nanoid";

export default function shortUrlGenerator () {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const generateCode = customAlphabet(alphabet, 6);

  const shortCode = generateCode();

  return shortCode;
}