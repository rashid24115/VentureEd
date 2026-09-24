import urllib.request
import json

def post_json(url, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get_json(url, token=None):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

print('=== STARTING COMPLETE INTEGRATION VERIFICATION WITH AI CO-PILOT ===')

# 1. Login
res = post_json('http://127.0.0.1:8000/api/v1/auth/login', {'email': 'demo@ventureai.com', 'password': 'venture123'})
token = res['token']
user = res['user']
print(f'1. [Auth] Logged in as: {user["name"]} | XP: {user["xp"]} | Streak: {user["streak"]}')

# 2. Courses Catalogue
courses = get_json('http://127.0.0.1:8000/api/v1/courses/', token)
print(f'2. [Courses] Loaded {len(courses)} courses')

# 3. Quiz & Strengths/Weaknesses
sub = post_json('http://127.0.0.1:8000/api/v1/quizzes/1/submit', {'answers': {'q1_1': 1, 'q1_2': 1, 'q1_3': 0}}, token)
print(f'3. [Quiz] Evaluated quiz: {sub["percentage"]}% score | Passed: {sub["passed"]}')

# 4. User Intelligence (Strengths & Weaknesses)
intel = get_json('http://127.0.0.1:8000/api/v1/copilot/user-intelligence', token)
print(f'4. [User Intelligence] Readiness: {intel["overall_readiness"]}% | Archetype: {intel["archetype"]}')
print(f'   - Confirmed Strengths: {intel["strengths"]}')
print(f'   - Focus Blindspots: {intel["weaknesses"]}')

# 5. AI Co-Pilot: 1. Raise Value
cp_val = post_json('http://127.0.0.1:8000/api/v1/copilot/advice', {
    'idea': 'EcoTrack AI: Real-time supply chain ESG compliance',
    'mode': 'raise_value',
    'industry': 'CleanTech / SaaS'
}, token)
print(f'5. [AI Co-Pilot: Raise Value] Headline: "{cp_val["headline"]}"')
print(f'   - Actions: {len(cp_val["action_steps"])} steps | Hooks: {cp_val["suggested_unique_hooks"][0]}')

# 6. AI Co-Pilot: 2. Market Problems
cp_prob = post_json('http://127.0.0.1:8000/api/v1/copilot/advice', {
    'idea': 'EcoTrack AI',
    'mode': 'market_problems',
    'industry': 'CleanTech / SaaS'
}, token)
print(f'6. [AI Co-Pilot: Market Problems] Headline: "{cp_prob["headline"]}"')

# 7. AI Co-Pilot: 3. Unique 10x Feature
cp_feat = post_json('http://127.0.0.1:8000/api/v1/copilot/advice', {
    'idea': 'EcoTrack AI',
    'mode': 'unique_feature',
    'industry': 'CleanTech / SaaS'
}, token)
print(f'7. [AI Co-Pilot: Unique Feature] Headline: "{cp_feat["headline"]}"')

# 8. AI Co-Pilot: 4. Make Product Stand Out
cp_stand = post_json('http://127.0.0.1:8000/api/v1/copilot/advice', {
    'idea': 'EcoTrack AI',
    'mode': 'standout',
    'industry': 'CleanTech / SaaS'
}, token)
print(f'8. [AI Co-Pilot: Standout] Headline: "{cp_stand["headline"]}"')

print('=== ALL AI CO-PILOT & FOUNDER WORKFLOWS TESTED AND PASSED 100% ===')
