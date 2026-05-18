from app.services.ai.agents.base_agent import BaseAgent

class VizAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Data Visualization Expert",
            goal="Select the most impactful and accurate visualization for the provided dataset."
        )

    def select_chart(self, query: str, data: list, nlu_data: dict):
        # Sample data to help LLM decide
        sample_data = data[:3] if data else []
        
        prompt = f"""
        User Query: "{query}"
        NLU Intent: {nlu_data.get('intent')}
        Data Sample (first 3 rows): {sample_data}
        Total Rows: {len(data)}
        
        Available Chart Types:
        - Basic: bar, stacked_bar, horizontal_bar, horizontal_stacked_bar, line, area, pie, donut, scatter, kpi_card, table
        - Advanced: heatmap, treemap, funnel, gauge, waterfall, boxplot, radar
        - Predictive: forecast_chart, anomaly_chart
        
        Selection Guidance:
        1. For datasets showing splits, breakdowns, or correlations between a main category (e.g. category, city) and a sub-categorical split (e.g. promo_type) mapping to a metric (e.g. revenue, volume), ALWAYS select 'stacked_bar' or 'horizontal_stacked_bar'.
        
        Select the BEST chart type and explain why.
        
        Respond with JSON:
        {{
            "chart_type": "string",
            "title": "Compelling Chart Title",
            "xKey": "column_name",
            "yKey": "column_name",
            "explanation": "Why this chart was selected based on data types and query intent.",
            "colors": ["hex_codes"]
        }}
        """
        return self.call_llm(prompt)
