# replace for recommendations and issues

import httpx
import os
import json

ANTHROPIC_API_KEY = os.getenv("CLAUDE_API_KEY")
CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"

async def get_llm_feedback(code: str) -> Dict[str, List[str]]:
    prompt = f"""
You are an expert software reviewer integrated into a CI/CD system.

Given the following code snippet, provide:
1. A list of critical issues detected in the code (e.g., security risks, missing validation, error handling).
2. A list of actionable recommendations to improve the code before deployment.

Respond ONLY with a JSON object like:
{{
  "issues": ["..."],
  "recommendations": ["..."]
}}

Code:
```{code}```
"""
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    payload = {
        "model": "claude-3-sonnet-20240229",
        "max_tokens": 512,
        "temperature": 0,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(CLAUDE_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        content = response.json()
        raw_text = content["content"][0]["text"]

    try:
        return json.loads(raw_text)
    except Exception:
        return {"issues": ["Unable to parse issues from LLM"], "recommendations": ["Check code manually."]}



# Replace
issues = analyzer.generate_issues(patterns, risk_score)
recommendations = analyzer.generate_recommendations(patterns, risk_score, approved)


# With this:
llm_feedback = await get_llm_feedback(request.code_changes)
issues = llm_feedback.get("issues", [])
recommendations = llm_feedback.get("recommendations", [])


