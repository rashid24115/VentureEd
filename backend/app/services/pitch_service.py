import os
import json
import random
from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas.pitch import PitchMessageResponse
from app.core.config import settings

PERSONA_PROMPTS = {
    "aggressive_vc": """You are Marc, an aggressive Silicon Valley VC. Stress-test the user's pitch. Focus on scale, CAC/LTV, TAM, and defensible moats. Be direct. Output MUST be strict valid JSON: {"sender": "ai_vc", "message": "<sharp follow-up>", "rating": <1-10 integer>, "criticismTag": "<2-3 word tag>"}""",
    "friendly_angel": """You are Sarah, an empathetic Angel Investor. Focus on founder-market fit, user pain points, and product vision. Output MUST be strict valid JSON: {"sender": "ai_vc", "message": "<supportive question>", "rating": <1-10 integer>, "criticismTag": "<short tag>"}""",
    "conservative_banker": """You are Mr. Henderson, a risk-averse commercial banker. Focus on immediate cash flow, fixed costs, and risk mitigation. Output MUST be strict valid JSON: {"sender": "ai_vc", "message": "<risk question>", "rating": <1-10 integer>, "criticismTag": "<risk tag>"}"""
}

FALLBACK_REPLIES = {
    "aggressive_vc": [
        ("Your top of funnel looks plausible, but what is your exact CAC payback period? If it's over 12 months, you're going to bleed capital at scale.", 6, "CAC Concerns"),
        ("What stops Microsoft or an open-source clone from shipping this exact feature next quarter? Explain your proprietary data moat.", 5, "Moat Vulnerability"),
        ("I like the ambition, but your TAM calculation feels hand-wavy. Show me bottom-up conversion metrics from your initial pilots.", 7, "TAM Discipline"),
        ("If you double your pricing tomorrow, what percentage of your current pipeline churns immediately?", 8, "Pricing Power")
    ],
    "friendly_angel": [
        ("I really connect with the human problem you're addressing. How did you personally discover this pain point?", 8, "Founder Fit"),
        ("Tell me about your favorite customer interview so far. What surprised you the most about how they work today?", 7, "Customer Empathy"),
        ("This has tremendous potential. What is the single biggest bottleneck holding your team back from launching right now?", 9, "Execution Momentum")
    ],
    "conservative_banker": [
        ("What are your recurring fixed overhead costs, and how soon does this operation achieve cash-flow breakeven without external equity?", 6, "Cash Flow Risk"),
        ("In the event of a severe macro downturn, what is your minimum viable monthly burn to maintain operations?", 5, "Downside Protection"),
        ("Are there any regulatory liabilities or compliance hurdles that could freeze your payment processing?", 6, "Regulatory Check")
    ]
}

class PitchService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or ""
        self.has_real_key = bool(api_key and "your_actual" not in api_key and "dummy" not in api_key)
        if self.has_real_key:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=api_key,
                    temperature=0.7
                )
            except Exception:
                self.has_real_key = False

    async def get_persona_reply(self, persona: str, user_message: str, chat_history: list) -> PitchMessageResponse:
        if self.has_real_key:
            try:
                system_prompt = PERSONA_PROMPTS.get(persona, PERSONA_PROMPTS["aggressive_vc"])
                formatted_history = "\n".join([f"{msg.get('sender', 'user')}: {msg.get('message', '')}" for msg in chat_history[-6:]])
                prompt = f"{system_prompt}\n\nRecent History:\n{formatted_history}\nUser Pitch: {user_message}\n\nRespond in JSON:"
                response = await self.llm.ainvoke(prompt)
                raw_text = response.content.replace("```json", "").replace("```", "").strip()
                data = json.loads(raw_text)
                return PitchMessageResponse(**data)
            except Exception:
                pass

        # Intelligent dynamic fallback
        candidates = FALLBACK_REPLIES.get(persona, FALLBACK_REPLIES["aggressive_vc"])
        msg, rating, tag = random.choice(candidates)
        return PitchMessageResponse(sender="ai_vc", message=msg, rating=rating, criticismTag=tag)

pitch_service = PitchService()