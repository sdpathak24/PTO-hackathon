import axios from 'axios';
import LeaveBalance from '../models/LeaveBalance.js';
import PTORequest from '../models/PTORequest.js';
import User from '../models/User.js';
import CoverageRule from '../models/CoverageRule.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent';

export const getChatbotResponse = async (message, userEmail) => {
  try {
    // Get user and their leave balance
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, response: "User not found. Please contact HR." };
    }

    const year = new Date().getFullYear();
    const leaveBalance = await LeaveBalance.findOne({ user: user._id, year });
    
    // Get user's leave history
    const leaveHistory = await PTORequest.find({ 
      user: user._id,
      status: 'approved'
    }).sort({ startDate: -1 }).limit(20);

    // Get team coverage rules
    const coverageRule = await CoverageRule.findOne({ team: user.team });

    // Determine intent and gather relevant data
    const intent = analyzeIntent(message);
    let contextData = {};

    switch (intent) {
      case 'balance_inquiry':
        contextData = { leaveBalance, leaveType: extractLeaveType(message) };
        break;
      case 'last_leave':
        contextData = { leaveHistory };
        break;
      case 'best_dates':
        contextData = { 
          leaveBalance, 
          team: user.team,
          role: user.role,
          coverageRule 
        };
        break;
      case 'leave_suggestion':
        contextData = { 
          leaveBalance, 
          leaveHistory,
          team: user.team,
          role: user.role 
        };
        break;
      case 'comparison':
        contextData = { leaveHistory };
        break;
      default:
        contextData = { leaveBalance, leaveHistory, user };
    }

    // Generate AI response
    const prompt = buildPrompt(intent, message, contextData, user);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      response: aiResponse,
      intent: intent,
      data: contextData
    };

  } catch (error) {
    console.error('Chatbot Service Error:', error.response?.data || error.message);
    return {
      success: false,
      response: "I'm having trouble processing your request right now. Please try again later."
    };
  }
};

const analyzeIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('balance') || lowerMessage.includes('left') || lowerMessage.includes('remaining')) {
    return 'balance_inquiry';
  }
  if (lowerMessage.includes('last') || lowerMessage.includes('previous') || lowerMessage.includes('when')) {
    return 'last_leave';
  }
  if (lowerMessage.includes('best') || lowerMessage.includes('good') || lowerMessage.includes('recommend')) {
    return 'best_dates';
  }
  if (lowerMessage.includes('suggest') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
    return 'leave_suggestion';
  }
  if (lowerMessage.includes('compare') || lowerMessage.includes('comparison') || lowerMessage.includes('difference') || lowerMessage.includes('trend')) {
    return 'comparison';
  }
  
  return 'general';
};

const extractLeaveType = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('personal') || lowerMessage.includes('vacation')) return 'personal';
  if (lowerMessage.includes('sick')) return 'sick';
  if (lowerMessage.includes('bereavement')) return 'bereavement';
  if (lowerMessage.includes('maternity')) return 'maternity';
  if (lowerMessage.includes('paternity')) return 'paternity';
  
  return null;
};

const buildPrompt = (intent, message, contextData, user) => {
  let prompt = `You are Athena, an AI assistant for SmartPTO management system. You are helping ${user.name}, who is a ${user.role} in the ${user.team} team. 

User Query: "${message}"

Context Data:`;

  switch (intent) {
    case 'balance_inquiry':
      prompt += `
Leave Balance Information:
${JSON.stringify(contextData.leaveBalance?.balances, null, 2)}

Respond with their leave balance. If they asked about a specific type, focus on that. Include remaining days and usage.`;
      break;

    case 'last_leave':
      prompt += `
Recent Leave History:
${contextData.leaveHistory.map(leave => ({
  type: leave.leaveType,
  dates: `${leave.startDate} to ${leave.endDate}`,
  days: leave.daysRequested
}))}

Summarize their last leave or recent leave patterns.`;
      break;

    case 'best_dates':
      prompt += `
Leave Balance:
${JSON.stringify(contextData.leaveBalance?.balances, null, 2)}

Team: ${contextData.team}
Role: ${contextData.role}
Coverage Rule: ${contextData.coverageRule ? JSON.stringify(contextData.coverageRule.minOnDuty, null, 2) : 'Not configured'}

Suggest the best dates for taking leave considering their balance, team coverage, and best practices.`;
      break;

    case 'leave_suggestion':
      prompt += `
Leave Balance:
${JSON.stringify(contextData.leaveBalance?.balances, null, 2)}

Recent History:
${contextData.leaveHistory.length} approved leaves

Give personalized leave suggestions based on their balance and usage patterns.`;
      break;

    case 'comparison':
      prompt += `
Recent PTO History:
${JSON.stringify(contextData.leaveHistory || [], null, 2)}

The user asked for a comparison of leave usage (e.g., sick leave in Sept vs Oct). 
Rules:
- Never ask the user again for dates or scope if they already mentioned "last month" and "this month".
- Always assume "last month" = previous calendar month, "this month" = current calendar month.
- Default to company-wide if no department is specified.
- Always respond with concrete numbers + percentage difference.
- Provide one short actionable insight.
`;
      break;

    default:
      prompt += `
General Info:
User: ${user.name}, Role: ${user.role}, Team: ${user.team}
Leave Balance: ${JSON.stringify(contextData.leaveBalance?.balances, null, 2)}

Provide a concise, helpful response.`;
  }

  // Role-specific tone
  prompt += `

Guidelines:
- If information is missing, assume defaults (company-wide, current year/month).
- HR responses: summary-style, professional, under 120 words.
- Manager responses: coverage-focused, concise, under 120 words.
- Employee responses: friendly, supportive, use emojis, under 200 words.
- Provide direct answers first, then optionally ask if they want more detail.
`;

  return prompt;
};

export default { getChatbotResponse };
