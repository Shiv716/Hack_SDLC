import httpx
import os

def analyze_code_with_claude(code):
    prompt = f"""\
Human: Analyze the following code and respond with JSON with these fields:
- has_validation
- has_error_handling
- has_auth
- has_sql_injection_risk
- has_hardcoded_secrets
- is_payment_code
- has_database_ops

Respond ONLY with a JSON object.

Code:
{code}
Assistant:"""

    headers = {
        "x-api-key": os.getenv("CLAUDE_API_KEY"),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    payload = {
        "model": "claude-3-sonnet-20240229",
        "max_tokens": 300,
        "temperature": 0,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers=headers,
        json=payload
    )

    json_output = response.json()
    # Extract and parse the actual text from Claude's output
    content = json_output["content"][0]["text"]
    return json.loads(content)


# Replace

patterns = await analyze_code_with_claude(code)
