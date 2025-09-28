import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCMaqYcVLFgJWj0cs4a3YB7deDQvONPpEQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

export const getAthenaRecommendation = async (analysisData) => {
  try {
    const prompt = `You are Athena, an AI assistant for SmartPTO management system. 
    
    Analyze this PTO coverage data and provide a smart recommendation:
    
    Team: ${analysisData.team || 'Unknown'}
    Role: ${analysisData.role || 'Unknown'}
    Team Count: ${analysisData.teamCount || 0}
    Min On Duty Required: ${analysisData.minOnDuty || 1}
    Currently Off: ${analysisData.overlapping || 0}
    Max Allowed Off: ${analysisData.maxAllowedOff || 0}
    Risk Level: ${analysisData.risk ? 'HIGH RISK' : 'SAFE'}
    Current Suggestion: ${analysisData.suggestion || 'No suggestion'}
    
    Please provide a friendly, professional recommendation as Athena. If there's a coverage risk, suggest alternatives like different dates or mention the impact on the team. If it's safe, confirm approval. Keep it concise but helpful.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      recommendation: aiResponse,
      model: response.data.modelVersion
    };

  } catch (error) {
    console.error('Athena AI Service Error:', error);
    return {
      success: false,
      recommendation: "I'm sorry, I'm having trouble analyzing this request right now. Please review the coverage analysis manually.",
      error: error.message
    };
  }
};

export default { getAthenaRecommendation };
