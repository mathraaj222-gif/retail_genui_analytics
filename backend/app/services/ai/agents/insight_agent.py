from app.services.ai.agents.base_agent import BaseAgent

class InsightAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Principal Data Scientist & Strategy Consultant",
            goal="Extract deep business insights, detect patterns, and provide executive-level recommendations."
        )

    def generate_insights(self, query: str, data: list, nlu_data: dict, viz_data: dict):
        prompt = f"""
        Original Query: "{query}"
        NLU Analysis: {nlu_data}
        Data Result: {data[:20]} (Showing first 20 rows)
        Chart Selected: {viz_data.get('chart_type')}
        
        Tasks:
        1. Executive Summary: A high-impact 1-2 sentence summary for a Sales Director.
        2. Detailed Insights: 3-5 specific findings (trends, anomalies, correlations).
        3. Recommendations: 2-3 actionable business strategies based on the data.
        4. Plain English Explanation: Explain what the data means without technical jargon.
        
        Respond with JSON:
        {{
            "executive_summary": "string",
            "insights": [
                {{"title": "string", "description": "string", "severity": "low"|"medium"|"high"}}
            ],
            "recommendations": [
                {{"action": "string", "impact": "string", "urgency": "low"|"medium"|"high"}}
            ],
            "plain_english": "string",
            "detected_patterns": ["anomaly", "trend", "correlation", "seasonality"]
        }}
        """
        return self.call_llm(prompt)
