from app.services.ai.llm_client import client

def generate_ai_insights(data_context):
    """
    Generates 3 deep, data-driven business insights using GPT-4.
    """
    prompt = f"""
    Act as a Principal Business Analyst. Analyze this retail dataset:
    {data_context}
    
    Identify 3 critical insights regarding performance, risks, or opportunities.
    Return JSON format: {{"insights": [{{ "title": "string", "description": "string", "severity": "low|medium|high" }}]}}
    """
    return client.generate_json(prompt)

def generate_executive_summary(data_context):
    """
    Generates a concise, high-impact summary for the Sales Director.
    """
    prompt = f"""
    Summarize the key takeaway from this data for an executive:
    {data_context}
    
    Focus on bottom-line impact. Keep it to 2 sentences.
    Return JSON format: {{"summary": "string"}}
    """
    return client.generate_json(prompt)

def generate_strategic_recommendations(data_context):
    """
    Suggests actionable strategies based on performance.
    """
    prompt = f"""
    Based on this performance data, suggest 3 strategic actions:
    {data_context}
    
    Return JSON format: {{"recommendations": [{{ "action": "string", "impact": "high|medium", "category": "string" }}]}}
    """
    return client.generate_json(prompt)
