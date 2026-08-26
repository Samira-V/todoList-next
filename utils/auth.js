import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { formatPersianDate } from "./date";

const hashPassword = async (password) => {
  // password = ali1212 => Hash => dngsbipnrg9ipbn39ubnj9unertn
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const generateToken = (data) => {
  const token = sign({ ...data }, process.env.JWT_SECRET, {
    // algorithm: ''
    expiresIn: "24h",
  });

  return token;
};

const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const verifyToken = (token) => {
  try {
    const validationResult = verify(token, process.env.JWT_SECRET);
    return validationResult;
  } catch (err) {
    console.log("Verify Token Error =>", err);
    return false;
  }
};



export const getTodayDate = () => {
  return formatPersianDate(new Date());
};


export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(d);
  const day = parts.find((p) => p.type === "day").value;
  const month = parts.find((p) => p.type === "month").value;
  const year = parts.find((p) => p.type === "year").value;

  return `${day} ${ month } ${ year }`;
};




export { hashPassword, generateToken, verifyPassword, verifyToken, getTodayDate };
