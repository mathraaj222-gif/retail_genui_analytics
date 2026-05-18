from app.services.ai.agents.base_agent import BaseAgent
from constants.promotions import PROMO_TYPES, CITIES, CATEGORIES, CAMPAIGNS, PRODUCTS

class NLUAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Natural Language Understanding Engine",
            goal="Clean user input, fix typos, detect semantic intent, and map business terms to database schema."
        )
        self.schema_context = f"""
        Tables & Columns:
        1. fact_events (f): event_id, store_id, campaign_id, product_code, base_price, promo_type, quantity_sold_bfr_promo, quantity_sold_aft_promo
        2. dim_products (p): product_code, product_name, category
        3. dim_campaigns (c): campaign_id, campaign_name, start_date, end_date
        4. dim_stores (s): store_id, city
        
        VALID DOMAIN VALUES (Strictly map user typo keywords to these exact spelling & cases):
        - promo_type: {PROMO_TYPES}
        - city: {CITIES}
        - category: {CATEGORIES}
        - campaign_name: {CAMPAIGNS}
        - product_name: {PRODUCTS}
        
        Key Business Metrics:
        - "Sales" / "Revenue" / "Income" -> SUM(f.quantity_sold_aft_promo * f.base_price)
        - "Units Sold" / "Volume" -> SUM(f.quantity_sold_aft_promo)
        - "Organic Sales" / "Before Promo" -> SUM(f.quantity_sold_bfr_promo)
        - "Incremental Sales" / "Uplift" -> SUM(f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo)
        - "Uplift %" -> (SUM(f.quantity_sold_aft_promo) - SUM(f.quantity_sold_bfr_promo)) / SUM(f.quantity_sold_bfr_promo) * 100
        """

    def process(self, user_query: str):
        prompt = f"""
        User Input: "{user_query}"
        
        System: You are an Elite NLU Engine. Your task is to extract intent from potentially messy, broken, or shorthand business questions.
        
        Examples to handle:
        - "show slaes by moth" -> Correct: "show sales by month", Intent: Descriptive
        - "profit trend" -> Intent: Descriptive/Trend, Metric: Uplift or Total Sales
        - "which product fail" -> Intent: Diagnostic, Metric: Low Uplift or Negative Growth
        - "future revenue" -> Intent: Predictive, Metric: Revenue Forecast
        - "why customer drop" -> Intent: Diagnostic, Metric: Retention/Store Visit Frequency
        
        Schema Context:
        {self.schema_context}
        
        Instructions:
        1. Fix ALL typos and spelling mistakes.
        2. Infer missing context (e.g., "sales" in this DB means 'quantity_sold_aft_promo' or revenue).
        3. Identify if the user wants: Descriptive (What happened), Diagnostic (Why it happened), Predictive (What will happen), or Prescriptive (How to make it happen).
        4. Extract timeframes, cities, and categories.
        
        Respond with JSON:
        {{
            "corrected_query": "string",
            "intent": "descriptive" | "diagnostic" | "predictive" | "prescriptive",
            "entities": {{
                "city": [],
                "category": [],
                "promo_type": [],
                "metrics": ["sales", "uplift", "margin", "volume"]
            }},
            "mapped_columns": [
                {{"term": "string", "column": "string", "table": "string", "logic": "SQL aggregation logic"}}
            ],
            "business_reasoning": "Explain why you interpreted the query this way."
        }}
        """
        return self.call_llm(prompt)

