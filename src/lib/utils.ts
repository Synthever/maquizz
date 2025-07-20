import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const generateQuizQuestions = (operation: string, level: string, count: number = 10) => {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    const questionData = generateSingleQuestion(operation, level);
    questions.push(questionData);
  }

  return questions;
};

const generateSingleQuestion = (operation: string, level: string) => {
  switch (level) {
    case 'easy':
      return generateEasyQuestion(operation);
    case 'medium':
      return generateMediumQuestion(operation);
    case 'hard':
      return generateHardQuestion(operation);
    case 'extreme':
      return generateExtremeQuestion();
    default:
      return generateEasyQuestion(operation);
  }
};

const generateEasyQuestion = (operation: string) => {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  
  let question = '';
  let answer = 0;
  
  switch (operation) {
    case 'addition':
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case 'subtraction':
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `${larger} - ${smaller}`;
      answer = larger - smaller;
      break;
    case 'multiplication':
      question = `${num1} × ${num2}`;
      answer = num1 * num2;
      break;
    case 'division':
      const dividend = num1 * num2;
      question = `${dividend} ÷ ${num1}`;
      answer = num2;
      break;
    case 'mixed':
      const ops = ['addition', 'subtraction', 'multiplication', 'division'];
      const randomOp = ops[Math.floor(Math.random() * ops.length)];
      return generateEasyQuestion(randomOp);
  }
  
  return { question, answer, operation, level: 'easy' };
};

const generateMediumQuestion = (operation: string) => {
  const num1 = Math.floor(Math.random() * 90) + 10;
  const num2 = Math.floor(Math.random() * 90) + 10;
  
  let question = '';
  let answer = 0;
  
  switch (operation) {
    case 'addition':
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case 'subtraction':
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `${larger} - ${smaller}`;
      answer = larger - smaller;
      break;
    case 'multiplication':
      const smallNum1 = Math.floor(Math.random() * 9) + 1;
      question = `${num1} × ${smallNum1}`;
      answer = num1 * smallNum1;
      break;
    case 'division':
      const divisor = Math.floor(Math.random() * 9) + 1;
      const dividend = num1 * divisor;
      question = `${dividend} ÷ ${divisor}`;
      answer = num1;
      break;
    case 'mixed':
      const ops = ['addition', 'subtraction', 'multiplication', 'division'];
      const randomOp = ops[Math.floor(Math.random() * ops.length)];
      return generateMediumQuestion(randomOp);
  }
  
  return { question, answer, operation, level: 'medium' };
};

const generateHardQuestion = (operation: string) => {
  const num1 = Math.floor(Math.random() * 900) + 100;
  const num2 = Math.floor(Math.random() * 900) + 100;
  
  let question = '';
  let answer = 0;
  
  switch (operation) {
    case 'addition':
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case 'subtraction':
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `${larger} - ${smaller}`;
      answer = larger - smaller;
      break;
    case 'multiplication':
      const smallNum = Math.floor(Math.random() * 90) + 10;
      question = `${num1} × ${smallNum}`;
      answer = num1 * smallNum;
      break;
    case 'division':
      const divisor = Math.floor(Math.random() * 90) + 10;
      const dividend = num1 * divisor;
      question = `${dividend} ÷ ${divisor}`;
      answer = num1;
      break;
    case 'mixed':
      const ops = ['addition', 'subtraction', 'multiplication', 'division'];
      const randomOp = ops[Math.floor(Math.random() * ops.length)];
      return generateHardQuestion(randomOp);
  }
  
  return { question, answer, operation, level: 'hard' };
};

const generateExtremeQuestion = () => {
  // Generate complex mixed operations
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const num3 = Math.floor(Math.random() * 10) + 1;
  const num4 = Math.floor(Math.random() * 10) + 1;
  
  const operations = ['+', '-', '×', '÷'];
  const op1 = operations[Math.floor(Math.random() * operations.length)];
  const op2 = operations[Math.floor(Math.random() * operations.length)];
  const op3 = operations[Math.floor(Math.random() * operations.length)];
  
  // Simple expression with parentheses for order of operations
  let question = '';
  let answer = 0;
  
  // Example: (a op1 b) op2 (c op3 d)
  const part1 = calculateOperation(num1, num2, op1);
  const part2 = calculateOperation(num3, num4, op3);
  answer = calculateOperation(part1, part2, op2);
  
  question = `(${num1} ${op1} ${num2}) ${op2} (${num3} ${op3} ${num4})`;
  
  return { question, answer, operation: 'mixed', level: 'extreme' };
};

const calculateOperation = (a: number, b: number, op: string): number => {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return Math.floor(a / b);
    default:
      return 0;
  }
};

export const getPointsForLevel = (level: string): number => {
  switch (level) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return 3;
    case 'extreme':
      return 5;
    default:
      return 1;
  }
};

export const getTimeLimitForLevel = (level: string): number => {
  switch (level) {
    case 'easy':
      return 60; // 1 minute
    case 'medium':
      return 120; // 2 minutes
    case 'hard':
      return 180; // 3 minutes
    case 'extreme':
      return 240; // 4 minutes
    default:
      return 60;
  }
};
