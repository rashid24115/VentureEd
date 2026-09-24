# Seed data for VentureEd platform

COURSES_DATA = [
    {
        "id": 1,
        "slug": "zero-to-one-ideation",
        "title": "Zero to One: Ideation & Problem Validation",
        "category": "Ideation",
        "difficulty": "Beginner",
        "duration": "2.5 hours",
        "rating": 4.9,
        "students_count": 3420,
        "description": "Master customer discovery interviews, separate real problems from fake noise, and learn how to formulate value propositions that customers will gladly pay for before writing a single line of code.",
        "cover_tag": "Validation Mastery",
        "icon_name": "Lightbulb",
        "syllabus": [
            {
                "module_id": "m1",
                "title": "Module 1: The Anatomy of a High-Impact Problem",
                "lessons": [
                    {
                        "lesson_id": "l1_1",
                        "title": "Hair on Fire vs Nice to Have",
                        "duration": "15 min",
                        "content": "### Identifying Real Founder Pain Points\n\nMost startups die not from failure to build, but failure to build something that matters. To succeed, your startup must solve a 'Tier-1 Problem'—a problem the customer is actively spending time or money attempting to fix today.\n\n#### The 3 Problem Filters:\n1. **High Frequency**: Happens daily or weekly.\n2. **High Severity**: Financial loss, regulatory risk, or extreme operational friction.\n3. **Existing Workarounds**: If people aren't using hacky spreadsheets or manual workflows to solve it, the pain may not be acute enough.\n\n> **Actionable Founder Rule:** If a prospective customer tells you 'That sounds interesting', that is a polite rejection. Look for emotional distress or urgent requests for early access."
                    },
                    {
                        "lesson_id": "l1_2",
                        "title": "The Mom Test: How to Talk to Customers Without Being Lied To",
                        "duration": "20 min",
                        "content": "### How to Ask Non-Leading Customer Questions\n\nPeople want to be nice and will compliment your concept, giving you false positive signals that burn months of runway.\n\n#### The Golden Rules of Customer Discovery:\n- **Talk about their life, not your idea:** Never ask 'Would you buy a product that does X?'. Ask 'How did you solve this last Tuesday?'.\n- **Ask about specific past behaviors, not generic opinions:** Past behavior is the only reliable predictor of future purchases.\n- **Listen 80%, talk 20%:** If you are pitching during a discovery interview, you are failing the interview.\n\n#### 3 Questions to Ask in Every Interview:\n1. *When was the last time this problem occurred, and what did it cost you?*\n2. *What specific software, tool, or manual process did you use to handle it?*\n3. *What did you hate most about the solutions you tried?*"
                    }
                ]
            },
            {
                "module_id": "m2",
                "title": "Module 2: Value Proposition & Market Sizing",
                "lessons": [
                    {
                        "lesson_id": "l1_3",
                        "title": "The 10x Value Proposition Formula",
                        "duration": "18 min",
                        "content": "### Crafting Irresistible Value Props\n\nSwitching costs are high. Inertia is your biggest competitor, not other startups. Your product must not be 10% better; it must deliver a **10x improvement** in speed, cost, or output quality.\n\n#### The Value Proposition Template:\n`We help [Specific Customer ICP] do [Crucial Objective] without [Painful Friction Point] by [Differentiated Mechanism].`\n\n#### Real-World Case: Superhuman Email\nInstead of another generic email client, Superhuman positioned itself as 'The fastest email experience in the world for executive operators', charging $30/mo and creating massive cult-like retention."
                    },
                    {
                        "lesson_id": "l1_4",
                        "title": "TAM, SAM & SOM: Estimating Market Potential",
                        "duration": "22 min",
                        "content": "### Bottom-Up Market Sizing for Pitch Decks\n\nInvestors immediately discount top-down estimates ('If we just get 1% of the $100B shoe market...'). You must use bottom-up sizing:\n\n- **TAM (Total Addressable Market):** Total annual spend if 100% of everyone who could ever use the product purchased it.\n- **SAM (Serviceable Addressable Market):** The portion of TAM targeted by your current product form factor and geography.\n- **SOM (Serviceable Obtainable Market):** The realistic revenue you can capture in the next 1-3 years with your distribution model.\n\n#### Formula:\n`Bottom-Up SOM = (Number of qualified leads in target niche) × (Annual Contract Value / ARPU)`"
                    }
                ]
            }
        ],
        "quiz_data": [
            {
                "id": "q1_1",
                "question": "During a customer discovery interview, a potential buyer says: 'Your app looks so cool, I would totally pay $20/month for that when you launch!'. How should you interpret this?",
                "options": [
                    "Strong confirmation that your pricing and value proposition are validated.",
                    "A polite, hypothetical false-positive; past behavior and pre-orders are the only real validation.",
                    "Time to immediately stop interviewing and write code.",
                    "A sign that you should raise the price to $50/month."
                ],
                "correct_index": 1,
                "explanation": "Hypothetical future promises cost the prospect zero dollars and are frequently pleasantries. True validation comes from understanding how they solved it in the past and getting skin in the game (letter of intent, deposit, or scheduled pilot)."
            },
            {
                "id": "q1_2",
                "question": "What is the primary indicator of a genuine 'hair-on-fire' customer problem?",
                "options": [
                    "The problem was mentioned in an industry analyst report.",
                    "The customer is already using painful manual workarounds or messy spreadsheets to solve it.",
                    "Everyone on Twitter agrees it's a huge problem.",
                    "The market has zero existing competitors."
                ],
                "correct_index": 1,
                "explanation": "If users are currently cobbling together duct-tape spreadsheets or hiring temp workers to handle an issue, they have proven budget and urgency to adopt a 10x dedicated solution."
            },
            {
                "id": "q1_3",
                "question": "Which market sizing methodology do top venture capital investors trust most?",
                "options": [
                    "Top-down research reports citing trillions in global GDP.",
                    "Bottom-up sizing based on identifiable customer count multiplied by Annual Contract Value (ACV).",
                    "Assuming 1% of the Chinese or US population will buy.",
                    "Taking competitor revenue and tripling it."
                ],
                "correct_index": 1,
                "explanation": "Bottom-up sizing demonstrates you understand your unit economics, specific Ideal Customer Profile (ICP), and realistic go-to-market mechanics."
            }
        ]
    },
    {
        "id": 2,
        "slug": "lean-mvp-playbook",
        "title": "The Lean MVP Playbook: Prototyping & Rapid Validation",
        "category": "Product",
        "difficulty": "Beginner",
        "duration": "3 hours",
        "rating": 4.85,
        "students_count": 2890,
        "description": "Learn how to build Minimum Viable Products without wasting months of engineering. Explore Wizard-of-Oz, Concierge, and Landing Page tests used by Dropbox, Buffer, and Zappos.",
        "cover_tag": "Product Speed",
        "icon_name": "Layers",
        "syllabus": [
            {
                "module_id": "m1",
                "title": "Module 1: Non-Code MVP Prototypes",
                "lessons": [
                    {
                        "lesson_id": "l2_1",
                        "title": "The 4 Core MVP Archetypes",
                        "duration": "18 min",
                        "content": "### Stop Coding Too Early\n\nAn MVP is not a half-baked version of your final product; it is the **fastest experiment to test your core value assumption**.\n\n#### The 4 Classic MVP Archetypes:\n1. **The Smoke Test / Landing Page MVP (Buffer style):** A high-converting one-page site with pricing tiers and a 'Start Trial' button that measures click-through intent.\n2. **The Wizard of Oz MVP (Zappos style):** The front-end looks automated, but the backend is operated manually by the founders behind the curtain.\n3. **The Concierge MVP (Food on the Table style):** Deliver the service 100% manually in-person or via WhatsApp to understand user behavior before building software.\n4. **The Explainer Video MVP (Dropbox style):** A 3-minute screen recording demonstrating the core workflow that generated 75,000 beta signups overnight."
                    },
                    {
                        "lesson_id": "l2_2",
                        "title": "Riskiest Assumption Testing (RAT)",
                        "duration": "20 min",
                        "content": "### De-risking What Will Kill You First\n\nRank your startup's core hypotheses into three buckets:\n- **Desirability**: Do users actually want this?\n- **Feasibility**: Can we technically build this with high reliability?\n- **Viability**: Can we sell this at a price that leaves healthy gross margins?\n\nAlways design your MVP to attack the highest-risk uncertainty first."
                    }
                ]
            },
            {
                "module_id": "m2",
                "title": "Module 2: Feedback Loops & Pivot vs Persevere",
                "lessons": [
                    {
                        "lesson_id": "l2_3",
                        "title": "The Build-Measure-Learn Feedback Loop",
                        "duration": "15 min",
                        "content": "### Cycle Velocity as a Competitive Moat\n\nStartups that win aren't smarter; they execute the Build-Measure-Learn loop in 48 hours instead of 6 months. Measure actionable metrics (retention cohort, repeat usage), not vanity metrics (page views, social likes)."
                    }
                ]
            }
        ],
        "quiz_data": [
            {
                "id": "q2_1",
                "question": "Which MVP strategy involves making the service appear fully automated to end users while founders fulfill tasks manually behind the scenes?",
                "options": [
                    "The Wizard of Oz MVP",
                    "The Open Source Release",
                    "The Microservices Architecture",
                    "The Full Stack Deployment"
                ],
                "correct_index": 0,
                "explanation": "The Wizard of Oz MVP lets you test user demand and operational edge cases without spending capital building backend algorithms before knowing if anyone cares."
            },
            {
                "id": "q2_2",
                "question": "What is the primary danger of prioritizing 'Vanity Metrics' over 'Actionable Metrics'?",
                "options": [
                    "Investors will praise you too much.",
                    "You feel like you are growing due to superficial numbers (e.g. signups/impressions) while underlying retention is zero.",
                    "Your cloud hosting bill will drop to zero.",
                    "The code will fail to compile."
                ],
                "correct_index": 1,
                "explanation": "Vanity metrics make founders feel good but don't correlate to sustainable revenue or product retention."
            }
        ]
    },
    {
        "id": 3,
        "slug": "unit-economics-financial-modeling",
        "title": "Startup Unit Economics: CAC, LTV & Financial Modeling",
        "category": "Finance",
        "difficulty": "Intermediate",
        "duration": "4 hours",
        "rating": 4.95,
        "students_count": 2100,
        "description": "Demystify startup finance: calculate Customer Acquisition Cost (CAC), Lifetime Value (LTV), Payback Period, Burn Multiples, and build an investor-grade 24-month runway forecast.",
        "cover_tag": "Finance & Runway",
        "icon_name": "TrendingUp",
        "syllabus": [
            {
                "module_id": "m1",
                "title": "Module 1: The Core Unit Economics",
                "lessons": [
                    {
                        "lesson_id": "l3_1",
                        "title": "The Golden CAC to LTV Ratio",
                        "duration": "25 min",
                        "content": "### The Engine of Profitable Growth\n\nTo build a venture-scale business, your unit economics must be fundamentally sound.\n\n#### The Formulas:\n- **CAC (Blended vs Paid):** `Total Sales & Marketing Spend in Month / New Customers Acquired`\n- **LTV:** `(Average Monthly Revenue per Account × Gross Margin %) / Monthly Churn Rate`\n\n#### The Venture Benchmark:\n- **LTV / CAC >= 3.0x**: Healthy business model.\n- **CAC Payback Period < 12 months**: Capital-efficient growth that attracts top-tier VCs.\n- **Gross Margin > 70%** for pure software, > 45% for tech-enabled marketplace."
                    },
                    {
                        "lesson_id": "l3_2",
                        "title": "Burn Rate, Net Runway & The Burn Multiple",
                        "duration": "22 min",
                        "content": "### Calculating Exact Runway\n\n- **Gross Burn:** Total cash out the door each month (salaries, servers, rent, tools).\n- **Net Burn:** `Gross Burn - Monthly Cash Collected`.\n- **Runway (Months):** `Total Cash in Bank / Average Net Monthly Burn`.\n\n#### The Burn Multiple (David Sacks metric):\n`Net Burn / Net New ARR generated`\n- Under 1.0x = Amazing capital efficiency\n- 1.0x - 1.5x = Good\n- Above 2.0x = Dangerous cash bleed"
                    }
                ]
            },
            {
                "module_id": "m2",
                "title": "Module 2: Financial Runway Projections",
                "lessons": [
                    {
                        "lesson_id": "l3_3",
                        "title": "Modeling Scenarios: Base, Bull & Bear",
                        "duration": "20 min",
                        "content": "### Preparing for the Downturn\n\nAlways maintain a dynamic spreadsheet with 3 scenarios. Never fundraise when you have less than 6 months of runway left—investors can smell desperation and negotiate punitive valuation terms."
                    }
                ]
            }
        ],
        "quiz_data": [
            {
                "id": "q3_1",
                "question": "A SaaS startup spends $30,000 on marketing and sales in June, acquiring 100 new paying customers. Each customer pays $50/mo at an 80% gross margin with a 2% monthly churn rate. What is the LTV/CAC ratio?",
                "options": [
                    "CAC = $300, LTV = $2,000 -> Ratio = 6.67x (Extremely healthy)",
                    "CAC = $100, LTV = $300 -> Ratio = 3.0x",
                    "CAC = $300, LTV = $500 -> Ratio = 1.67x (Dangerous)",
                    "CAC = $50, LTV = $2,500 -> Ratio = 50x"
                ],
                "correct_index": 0,
                "explanation": "CAC = $30,000 / 100 = $300. LTV = ($50 * 0.80) / 0.02 = $40 / 0.02 = $2,000. LTV/CAC = 2000 / 300 = 6.67x, which far exceeds the 3.0x benchmark."
            },
            {
                "id": "q3_2",
                "question": "Your startup has $600,000 in the bank, expenses of $65,000/mo, and monthly revenue of $15,000. How many months of runway do you have remaining?",
                "options": [
                    "6.5 months",
                    "12 months",
                    "9.2 months",
                    "40 months"
                ],
                "correct_index": 1,
                "explanation": "Net monthly burn = $65,000 - $15,000 = $50,000. Runway = $600,000 / $50,000 = 12 months."
            }
        ]
    },
    {
        "id": 4,
        "slug": "growth-hacking-gtm-strategy",
        "title": "Growth Hacking & Go-To-Market (GTM) Strategy",
        "category": "Growth",
        "difficulty": "Intermediate",
        "duration": "3.5 hours",
        "rating": 4.88,
        "students_count": 1950,
        "description": "Unlock repeatable customer acquisition channels. Master Product-Led Growth (PLG), inbound content funnels, outbound cold email architecture, and conversion rate optimization.",
        "cover_tag": "Customer Acquisition",
        "icon_name": "Rocket",
        "syllabus": [
            {
                "module_id": "m1",
                "title": "Module 1: Go-To-Market Archetypes",
                "lessons": [
                    {
                        "lesson_id": "l4_1",
                        "title": "Product-Led vs Sales-Led GTM",
                        "duration": "20 min",
                        "content": "### Choosing Your Growth Motion\n\n1. **Product-Led Growth (PLG):** The product sells itself through freemium or self-serve trials (e.g. Slack, Figma, Zoom, Notion). Focus on Time-To-Value (TTV) under 5 minutes.\n2. **Sales-Led Growth (Enterprise):** High ACV ($25k+), complex security/procurement, account executives, and multi-month sales cycles (e.g. Snowflake, Workday).\n\nNever mix high touch enterprise sales motion with $10/month pricing—your unit economics will collapse."
                    },
                    {
                        "lesson_id": "l4_2",
                        "title": "Acquisition Loops vs Funnels",
                        "duration": "20 min",
                        "content": "### Compounding Growth Loops\n\nTraditional linear funnels lose energy at the bottom. Loops reinvest the output of one cycle into the next:\n- **Viral Loop:** User invites teammates or sends invoices branded with your logo.\n- **Content Loop:** User-generated content is indexed by Google, attracting more organic search users."
                    }
                ]
            }
        ],
        "quiz_data": [
            {
                "id": "q4_1",
                "question": "What is the key prerequisite before aggressively spending capital on paid advertising (e.g. Meta / Google Ads)?",
                "options": [
                    "A fancy office and trademarked logo.",
                    "Proven product retention with flat cohorts, ensuring users aren't leaking out of a leaky bucket.",
                    "Hiring a 10-person marketing agency.",
                    "Raising at least $5M from venture funds."
                ],
                "correct_index": 1,
                "explanation": "If your cohort retention curve decays to zero, pouring ad spend into acquisition simply accelerates cash incineration."
            }
        ]
    },
    {
        "id": 5,
        "slug": "venture-capital-pitching-playbook",
        "title": "Venture Capital & Pitching: Raising Pre-Seed & Seed",
        "category": "Fundraising",
        "difficulty": "Advanced",
        "duration": "4.5 hours",
        "rating": 4.97,
        "students_count": 2650,
        "description": "Crack the VC code. Build a winning 10-slide pitch deck, understand SAFEs, discount rates, valuation caps, and master the psychology of investor objection handling.",
        "cover_tag": "Fundraising Mastery",
        "icon_name": "DollarSign",
        "syllabus": [
            {
                "module_id": "m1",
                "title": "Module 1: The Pitch Deck Anatomy",
                "lessons": [
                    {
                        "lesson_id": "l5_1",
                        "title": "The 10-Slide Investor Deck Structure",
                        "duration": "25 min",
                        "content": "### The Universal Storytelling Arc\n\nInvestors review pitch decks in under 3 minutes. Your narrative must be airtight:\n1. **Title & One-liner**: Immediate clarity.\n2. **Problem**: Acute, painful, verified.\n3. **Solution**: Unique, defensible mechanism.\n4. **Market Size**: Bottom-up TAM/SAM/SOM.\n5. **Traction & Milestones**: MoM growth, pre-orders, or waitlist metrics.\n6. **Business Model**: Unit economics, pricing, revenue channels.\n7. **Go-To-Market**: Unfair distribution advantage.\n8. **Competition**: 2x2 matrix highlighting differentiation.\n9. **Team**: Founder-market fit and relevant unfair superpower.\n10. **The Ask**: Target amount ($1M), milestone to achieve (18 mo runway, $50k MRR)."
                    },
                    {
                        "lesson_id": "l5_2",
                        "title": "SAFEs vs Priced Rounds & Valuation Caps",
                        "duration": "25 min",
                        "content": "### Demystifying YC Post-Money SAFEs\n\nA SAFE (Simple Agreement for Future Equity) is not debt and has no interest rate or maturity date. It converts into equity during the next priced round.\n\n- **Valuation Cap:** The maximum effective company valuation at which your SAFE converts. Protects investors if company valuation skyrockets.\n- **Discount Rate:** Usually 15-20% discount on the next round's share price.\n- **Post-Money vs Pre-Money:** Modern post-money SAFEs make founder dilution instantly calculable: `Investment / Cap = Exact Investor Ownership %`."
                    }
                ]
            }
        ],
        "quiz_data": [
            {
                "id": "q5_1",
                "question": "An angel investor offers you $200,000 on a Post-Money SAFE with an $8,000,000 Valuation Cap. Assuming no other SAFEs, what percentage of your company will this investor own upon conversion?",
                "options": [
                    "2.5%",
                    "5.0%",
                    "10.0%",
                    "20.0%"
                ],
                "correct_index": 0,
                "explanation": "$200,000 divided by the $8,000,000 post-money valuation cap equals exactly 0.025 (2.5%)."
            },
            {
                "id": "q5_2",
                "question": "What is the single most common reason VCs pass on early-stage pre-seed pitch decks?",
                "options": [
                    "The slides don't have enough complex financial formulas.",
                    "Lack of clarity on the problem, vague customer segment, and unconvincing founder-market fit.",
                    "The font size is 14pt instead of 16pt.",
                    "The startup has too many early customers."
                ],
                "correct_index": 1,
                "explanation": "VCs invest in founders who show razor-sharp clarity about the exact problem they are attacking and why this team is uniquely positioned to win."
            }
        ]
    },
    {
        "id": 6,
        "slug": "founder-legal-cap-tables",
        "title": "Legal, Cap Tables & Founder Equity Architecture",
        "category": "Finance",
        "difficulty": "Intermediate",
        "duration": "2 hours",
        "rating": 4.91,
        "students_count": 1780,
        "description": "Avoid fatal founding mistakes. Set up 4-year vesting with a 1-year cliff, avoid co-founder deadlock, handle intellectual property assignment, and understand 83(b) elections.",
        "cover_tag": "Legal & Equity",
        "icon_name": "Shield",
        "syllabus": [
            {
                "module_id": "m1",
                "title": "Module 1: Equity Splits & Vesting Schedules",
                "lessons": [
                    {
                        "lesson_id": "l6_1",
                        "title": "Standard 4-Year Vesting with 1-Year Cliff",
                        "duration": "20 min",
                        "content": "### Protecting the Cap Table from Walkaways\n\nNever issue 100% of founder equity upfront without vesting. If a co-founder leaves after 4 months, they would otherwise walk away with 50% of your company.\n\n- **1-Year Cliff:** Zero shares vest during months 1-12. On day 365, 25% vests at once.\n- **Monthly Vesting Thereafter:** The remaining 75% vests in equal monthly increments across the next 36 months (1/48th per month)."
                    }
                ]
            }
        ],
        "quiz_data": [
            {
                "id": "q6_1",
                "question": "A co-founder leaves the company after 8 months under a standard 4-year vesting agreement with a 1-year cliff. How much of their equity do they retain?",
                "options": [
                    "0% (The 1-year cliff was not reached)",
                    "16.6%",
                    "25%",
                    "50%"
                ],
                "correct_index": 0,
                "explanation": "Under standard cliff agreements, leaving before 12 months means zero equity has vested, protecting the surviving founders and future investors."
            }
        ]
    }
]

# 6 Pillars for Founder Knowledge Strength Diagnostic
ASSESSMENT_QUESTIONS = [
    {
        "id": "dim_market_1",
        "pillar": "Market & Ideation",
        "pillar_key": "market",
        "question": "How do you systematically validate that a customer's pain point is genuine rather than polite approval?",
        "options": [
            "We conduct a survey on social media and ask if they like the product idea.",
            "We look for existing manual workarounds/spreadsheets and secure pre-payments, LOIs, or pilot time commitments.",
            "We rely on market research reports showing industry growth projections.",
            "We ask family and friends what they would pay for our service."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_market_2",
        "pillar": "Market & Ideation",
        "pillar_key": "market",
        "question": "What is the best way to estimate your Bottom-Up Serviceable Obtainable Market (SOM)?",
        "options": [
            "Take 1% of the total industry market size provided by Gartner.",
            "Multiply identifiable, high-intent ICP accounts by realistic Annual Contract Value (ACV) attainable with your direct channels.",
            "Use total consumer spending in your country.",
            "Sum up competitor total annual revenues."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_product_1",
        "pillar": "Product & MVP Strategy",
        "pillar_key": "product",
        "question": "Which MVP strategy minimizes engineering waste when testing complex algorithmic or AI functionality?",
        "options": [
            "A complete microservices rebuild with automated CI/CD pipelines.",
            "A Wizard of Oz or Concierge prototype where founders manually perform the backend operations behind a slick UI.",
            "Building 100% of the feature set before showing any users to ensure high quality.",
            "Buying an expensive off-the-shelf enterprise solution."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_product_2",
        "pillar": "Product & MVP Strategy",
        "pillar_key": "product",
        "question": "When assessing product-market fit, which metric is the most reliable indicator of true sustainable demand?",
        "options": [
            "Cumulative registered user count since launch.",
            "Flat or smiling retention cohort curves at Day 30 and Day 90.",
            "Number of upvotes on Product Hunt.",
            "Number of impressions on your promotional videos."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_gtm_1",
        "pillar": "Go-To-Market & Growth",
        "pillar_key": "gtm",
        "question": "Which condition makes Product-Led Growth (PLG) the optimal go-to-market motion for your venture?",
        "options": [
            "The product costs $100,000/year and requires 3 months of enterprise compliance audits.",
            "Individual end-users experience fast time-to-value (< 5 mins) and can self-serve onboard with viral expansion loops.",
            "Your company has no website and relies exclusively on door-to-door sales.",
            "You only sell to federal government departments."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_gtm_2",
        "pillar": "Go-To-Market & Growth",
        "pillar_key": "gtm",
        "question": "Why is it risky to scale paid marketing acquisition channels (e.g. Meta / Google Ads) before product retention is stable?",
        "options": [
            "Ad networks will ban your ad account.",
            "Acquired users immediately churn out, resulting in negative ROI and burned capital (the 'leaky bucket' syndrome).",
            "It makes your company valuation too high.",
            "Google will prioritize your competitors."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_finance_1",
        "pillar": "Financial Literacy & Unit Economics",
        "pillar_key": "finance",
        "question": "What is the standard venture benchmark for a healthy LTV / CAC ratio in early-stage SaaS and tech businesses?",
        "options": [
            "At least 3.0x with a CAC payback period under 12 months.",
            "0.5x, because scale will compensate for losses.",
            "1.0x (breaking even is the goal).",
            "100x regardless of payback period."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_finance_2",
        "pillar": "Financial Literacy & Unit Economics",
        "pillar_key": "finance",
        "question": "If your startup has $450,000 in cash, monthly operational expenses of $40,000, and revenues of $10,000, what is your net monthly runway?",
        "options": [
            "11.25 months",
            "15.0 months",
            "45.0 months",
            "7.5 months"
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_fundraising_1",
        "pillar": "Fundraising & Investor Relations",
        "pillar_key": "fundraising",
        "question": "How does a Post-Money SAFE protect an early-stage investor compared to older note structures?",
        "options": [
            "It gives the investor guaranteed annual cash dividends.",
            "It locks in the investor's exact ownership percentage against all other SAFEs issued prior to the priced round.",
            "It guarantees an immediate seat on the board of directors.",
            "It allows the investor to seize company IP at any time."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_fundraising_2",
        "pillar": "Fundraising & Investor Relations",
        "pillar_key": "fundraising",
        "question": "What should be the primary objective of your early-stage Pre-Seed pitch deck?",
        "options": [
            "Provide 80 pages of exhaustive code documentation.",
            "Convey an undeniable narrative: urgent problem, defensible solution, founder-market fit, and clear path to key milestones.",
            "Convince investors to write a check without meeting you in person.",
            "Hide your competitors so investors assume you have no competition."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_execution_1",
        "pillar": "Execution & Founder Resilience",
        "pillar_key": "execution",
        "question": "Why is a 4-year vesting schedule with a 1-year cliff considered non-negotiable among seasoned founders and investors?",
        "options": [
            "It prevents founders from ever selling any shares.",
            "It ensures that a founder who departs early does not walk away with a large unearned equity stake that ruins the cap table.",
            "It allows founders to avoid paying taxes permanently.",
            "It is mandated by federal banking law."
        ],
        "correct_index": 1,
        "weight": 10
    },
    {
        "id": "dim_execution_2",
        "pillar": "Execution & Founder Resilience",
        "pillar_key": "execution",
        "question": "How should high-performance founders prioritize tasks when faced with conflicting user requests and limited runway?",
        "options": [
            "Build whatever feature was requested most recently by a vocal user.",
            "Use an impact-versus-effort matrix focused strictly on de-risking the core value proposition and driving user retention.",
            "Stop building and wait for an investor to tell you what to do.",
            "Hire 5 external agencies to build everything in parallel."
        ],
        "correct_index": 1,
        "weight": 10
    }
]
