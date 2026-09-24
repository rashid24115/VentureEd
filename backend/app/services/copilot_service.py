import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas.copilot import CopilotResponse
from app.core.config import settings

MODE_META = {
    "raise_value": {
        "label": "Raise Market Value & Pricing Power",
        "headline_prefix": "Value Maximization Playbook for",
    },
    "market_problems": {
        "label": "Market Problem & Pain Discovery",
        "headline_prefix": "Acute Customer Friction & Discovery Guide for",
    },
    "unique_feature": {
        "label": "10x Unique Feature & Moat Ideation",
        "headline_prefix": "Defensible 10x Feature Architecture for",
    },
    "standout": {
        "label": "Product Standout & Market Positioning",
        "headline_prefix": "Market Differentiation & Narrative Hook for",
    }
}

def generate_heuristic_advice(idea: str, mode: str, industry: str) -> CopilotResponse:
    title_snippet = idea[:60].strip() if len(idea) > 60 else idea.strip()
    meta = MODE_META.get(mode, MODE_META["raise_value"])

    if mode == "raise_value":
        return CopilotResponse(
            mode=mode,
            mode_label=meta["label"],
            headline=f"How to 3x-5x Perceived Value for '{title_snippet}'",
            summary=f"To dramatically raise market value and pricing power for your venture in {industry}, shift positioning from a 'convenience utility' to an 'indispensable revenue or risk-reduction engine'. Customers pay 10x more for software that either makes them money or shields them from regulatory/financial catastrophe.",
            action_steps=[
                "Anchor Pricing to Tangible Customer ROI: Quantify the exact hours saved or extra revenue generated per month (e.g. 'Saves 15 engineering hours weekly = $3,500/mo net savings'). Charge 15-20% of the value created.",
                "Introduce Outcome-Based or Tiered Packaging: Create a high-margin Pro/Enterprise tier with priority SLA, automated audit reports, and dedicated account onboarding.",
                "Transform from Tool into System of Record: Integrate directly with client databases, CRMs, or ERPs so your product becomes the authoritative single source of truth.",
                "Package Workflow Automation: Instead of just displaying data, automate the end-to-end task (e.g. don't just find invoice errors—automatically draft correction requests)."
            ],
            strategic_insights=[
                "Founders who charge too little signal poor product confidence to enterprise buyers.",
                "A 20% price increase with zero churn instantly expands gross margins and cuts your CAC payback period in half.",
                "Annual upfront billing with a 15% discount accelerates working capital and eliminates payment failure risk."
            ],
            metrics_to_track=[
                "Average Revenue Per User (ARPU)",
                "Net Dollar Retention (NDR) target > 115%",
                "CAC Payback Period under 9 months"
            ],
            suggested_unique_hooks=[
                f"Guaranteed 30-day ROI: '{title_snippet}' pays for itself within the first billing cycle or your money back.",
                "The Executive Intelligence Layer: Automated weekly executive summaries sent directly to C-level stakeholders."
            ]
        )

    elif mode == "market_problems":
        return CopilotResponse(
            mode=mode,
            mode_label=meta["label"],
            headline=f"Uncovering Tier-1 'Hair-On-Fire' Problems for '{title_snippet}'",
            summary=f"Deep customer discovery in {industry} requires isolating problems that users are actively spending money or hacking together ugly manual workarounds (spreadsheets, scripts) to handle today.",
            action_steps=[
                "Shadow 5 Target Users: Watch them perform their current workflow over screen-share without speaking. Note every copy-paste step, spreadsheet export, or manual verification.",
                "Ask The Mom Test Questions: 'When was the last time this broke? What did it cost in lost deals or wasted hours? What tool did you try that failed?'",
                "Map the Cost of Inaction (COI): Quantify the dollar loss of ignoring the problem for 12 months (fines, churned clients, overtime pay).",
                "Identify the Economic Buyer vs the Daily Operator: Ensure the person with budget authority feels the pain even if they are not the day-to-day user."
            ],
            strategic_insights=[
                "If prospective customers say 'That sounds interesting', they are being polite. If they ask 'Can I pay for early access today?', you have found real pain.",
                "Look for workflows where operators maintain multiple browser tabs simultaneously—that indicates a broken, fragmented workflow ripe for disruption."
            ],
            metrics_to_track=[
                "Problem Urgency Score (1-10 on customer interview audits)",
                "Average manual hours spent per week on current workaround",
                "Letter of Intent (LOI) conversion rate from discovery calls"
            ],
            suggested_unique_hooks=[
                "The 1-Click Migration: Ingest existing messy spreadsheets in seconds without changing how teams currently work.",
                "Real-time Friction Radar: Automated alerts before a problem escalates into an expensive emergency."
            ]
        )

    elif mode == "unique_feature":
        return CopilotResponse(
            mode=mode,
            mode_label=meta["label"],
            headline=f"10x Defensible Feature & Moat Strategy for '{title_snippet}'",
            summary=f"Features are easy to copy; compounding defensible systems are not. To make '{title_snippet}' truly defensible, design a feature that creates either network effects, proprietary domain data assets, or prohibitive switching friction.",
            action_steps=[
                "Build a Closed-Loop Data Flywheel: Every customer interaction should train your proprietary domain model, making the product smarter for everyone as usage scales.",
                "Develop an Ambient or 'Ghost' Workflow: Instead of requiring users to open your dashboard, meet them where they already live (Chrome Extension, Slack bot, email plugin).",
                "Implement Instant Time-to-Value (TTV < 3 minutes): Allow users to upload a single file or connect one OAuth and experience an 'Aha!' insight without filling out forms.",
                "Create Programmatic Collaboration Hooks: Multi-player shared reports or audit trails that require colleagues or external auditors to log in and interact."
            ],
            strategic_insights=[
                "A feature that saves 10% of time gets replaced by a cheaper competitor. A feature that uncovers insights impossible to calculate manually creates customer lock-in.",
                "Embed regulatory or compliance checklists into the workflow—businesses never switch away from tools that verify their legal compliance."
            ],
            metrics_to_track=[
                "Feature Adoption Rate across first 7 days",
                "Daily Active to Monthly Active ratio (DAU/MAU)",
                "Organic referral invites generated per active account"
            ],
            suggested_unique_hooks=[
                "Predictive Auto-Pilot: Not just analytics, but automated one-click remediation actions.",
                "Self-Healing Audit Trail: Verifiable history that external partners or investors can review with read-only access."
            ]
        )

    else:  # standout
        return CopilotResponse(
            mode=mode,
            mode_label=meta["label"],
            headline=f"How to Make '{title_snippet}' Stand Out & Dominate the Category",
            summary=f"In crowded markets, the worst thing you can be is 'slightly better'. To stand out, you must be fundamentally different in narrative, speed, or focus. Position against the frustrating status quo of legacy incumbents in {industry}.",
            action_steps=[
                "Declare an Enemy: Frame your product against the painful legacy status quo (e.g. 'The anti-spreadsheet tool', 'No more 3-month consulting implementations').",
                "Craft a Razor-Sharp One-Liner: Use the formula: 'The [10x speed/cost mechanism] that helps [ICP] achieve [Dream Outcome] without [Nightmare Friction]'.",
                "Publish an Opinionated Manifesto / Founder Playbook: Share tactical teardowns of common industry failures on LinkedIn, Twitter, and Substack to establish thought leadership.",
                "Design a Show-Stopping Landing Page Demo: Replace generic stock mockups with an interactive sandbox where visitors can test the core feature in 30 seconds without signing up."
            ],
            strategic_insights=[
                "Positioning is not what you do to a product; it is what you do to the mind of the prospect.",
                "If everyone in your market uses corporate blue and buzzwords, use crisp typography, bold dark mode, and straightforward human language."
            ],
            metrics_to_track=[
                "Landing Page Visitor-to-Sign-up Conversion Rate (> 8% benchmark)",
                "Organic Social Share Rate on Founder Playbooks",
                "Win Rate in direct competitive bake-offs"
            ],
            suggested_unique_hooks=[
                f"The 10x Rule: '{title_snippet}' completes in 4 clicks what takes enterprise tools 45 minutes.",
                "Zero Onboarding Friction: Connect your workflow in 60 seconds without talking to an enterprise salesperson."
            ]
        )

class CopilotService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or ""
        self.has_real_key = bool(api_key and "your_actual" not in api_key and "dummy" not in api_key)
        if self.has_real_key:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=api_key,
                    temperature=0.5
                )
            except Exception:
                self.has_real_key = False

    async def get_advice(self, idea: str, mode: str, industry: str = "Tech / SaaS", weakness: str = None) -> CopilotResponse:
        # Fallback generator provides rich, deterministic output
        fallback = generate_heuristic_advice(idea, mode, industry)
        if not self.has_real_key:
            return fallback

        try:
            prompt = f"""You are a world-class startup incubator mentor and venture partner.
Analyze this startup idea and generate structured tactical advice for the following strategic objective:

Startup Idea: {idea}
Industry: {industry}
Objective: {MODE_META.get(mode, {{}}).get("label", mode)}
Context / Weakness to overcome: {weakness or "General early stage optimization"}

Provide your response in strict JSON with the following keys:
{{
  "mode": "{mode}",
  "mode_label": "{MODE_META.get(mode, {{}}).get("label", mode)}",
  "headline": "<punchy, compelling title>",
  "summary": "<2-3 sentence strategic executive summary>",
  "action_steps": ["<actionable step 1>", "<actionable step 2>", "<actionable step 3>", "<actionable step 4>"],
  "strategic_insights": ["<investor insight 1>", "<investor insight 2>"],
  "metrics_to_track": ["<metric 1>", "<metric 2>", "<metric 3>"],
  "suggested_unique_hooks": ["<copyable value prop hook 1>", "<copyable hook 2>"]
}}
Only return JSON:"""

            response = await self.llm.ainvoke(prompt)
            raw = response.content.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw)
            return CopilotResponse(**data)
        except Exception:
            return fallback

copilot_service = CopilotService()
