import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.schemas.lean_canvas import LeanCanvasSchema
from app.core.config import settings

def generate_fallback_canvas(idea_description: str) -> dict:
    """Generate high-quality heuristic startup canvas if AI API key is unavailable or throttled."""
    idea_summary = idea_description[:80] if len(idea_description) > 80 else idea_description
    return {
        "problem": [
            f"Lack of efficient automated workflows for {idea_summary}",
            "High manual operational friction and fragmented existing tools",
            "Slow time-to-market and high upfront capital costs for operators"
        ],
        "solution": [
            "AI-assisted unified workflow engine tailored to customer needs",
            "Real-time analytics and predictive recommendations",
            "Frictionless self-serve onboarding with automated integrations"
        ],
        "key_metrics": [
            "Weekly Active Users (WAU) and core workflow completion rate",
            "Monthly Recurring Revenue (MRR) and CAC Payback Period",
            "Net Promoter Score (NPS) and 30-day cohort retention"
        ],
        "unique_value_proposition": f"The intelligent, 10x faster platform to solve {idea_summary} without operational complexity.",
        "unfair_advantage": "Proprietary domain dataset, compounding data flywheel, and high-velocity product execution.",
        "channels": [
            "Targeted B2B outbound & LinkedIn niche founder communities",
            "Product-Led Growth (PLG) viral referral invitations",
            "Search-optimized educational content & founder playbooks"
        ],
        "customer_segments": [
            "Early-stage tech founders and startup operators",
            "Independent entrepreneurs and modern venture builders",
            "Forward-thinking teams looking to streamline workflows"
        ],
        "cost_structure": [
            "Cloud infrastructure & AI inference token costs",
            "Core engineering, design, and product team salaries",
            "Targeted customer acquisition & developer advocacy"
        ],
        "revenue_streams": [
            "Tiered monthly SaaS subscription ($29 - $149/mo)",
            "Usage-based add-ons for high-volume enterprise users",
            "Annual enterprise contracts with dedicated support"
        ]
    }

def generate_fallback_swot(idea_description: str) -> dict:
    return {
        "strengths": [
            "Clear, acute value proposition targeting high-intent founders",
            "Lightweight software architecture with fast iteration cycle",
            "High gross margins and scalable recurring SaaS business model"
        ],
        "weaknesses": [
            "Early brand awareness compared to legacy incumbents",
            "Need to establish initial reference customer case studies",
            "Dependence on third-party foundational APIs"
        ],
        "opportunities": [
            "Rapid expansion into adjacent vertical markets",
            "Product-Led Growth flywheel lowering blended CAC",
            "Strategic partnerships with accelerators and incubators"
        ],
        "threats": [
            "Potential feature replication by well-funded competitors",
            "Shifting customer expectations and pricing sensitivity",
            "Platform API policy changes"
        ]
    }

class AIService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or ""
        self.has_real_key = bool(api_key and "your_actual" not in api_key and "dummy" not in api_key)
        
        if self.has_real_key:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=api_key,
                    temperature=0.4
                )
                self.parser = JsonOutputParser(pydantic_object=LeanCanvasSchema)
            except Exception:
                self.has_real_key = False

    async def generate_lean_canvas(self, idea_description: str) -> dict:
        if not self.has_real_key:
            return generate_fallback_canvas(idea_description)

        try:
            prompt_template = PromptTemplate(
                template="""You are an expert startup incubator mentor.
Analyze the following startup idea and generate a structured 9-box Lean Canvas framework.

Startup Idea: {idea}

{format_instructions}""",
                input_variables=["idea"],
                partial_variables={"format_instructions": self.parser.get_format_instructions()}
            )
            chain = prompt_template | self.llm | self.parser
            result = await chain.ainvoke({"idea": idea_description})
            return result
        except Exception:
            return generate_fallback_canvas(idea_description)

ai_service = AIService()