from app.services.database import execute_query
from app.services.ui_schema.component_mapper import build_genui_response
from app.services.ai.llm_client import client

class NLQueryEngine:
    """
    Advanced Text-to-SQL Engine.
    Uses GPT-4 to translate business questions into optimized SQL.
    """
    def __init__(self):
        self.schema_context = """
        Tables:
        1. fact_events (event_id, store_id, campaign_id, product_code, base_price, promo_type, quantity_sold_bfr_promo, quantity_sold_aft_promo)
        2. dim_products (product_code, product_name, category)
        3. dim_campaigns (campaign_id, campaign_name, start_date, end_date)
        4. dim_stores (store_id, city)
        
        Rules:
        - Quantity Sold: quantity_sold_aft_promo
        - Growth/Uplift: (quantity_sold_aft_promo - quantity_sold_bfr_promo)
        - Always join fact_events with dimension tables for names.
        """

    def process(self, prompt: str):
        llm_prompt = f"""
        Given the following SQL Schema:
        {self.schema_context}
        
        Translate this business question into a single PostgreSQL query:
        "{prompt}"
        
        Return JSON format: {{"sql": "string", "title": "short descriptive title"}}
        """
        
        try:
            ai_result = client.generate_json(llm_prompt)
            sql = ai_result.get("sql")
            title = ai_result.get("title", "AI Analysis Results")
            
            print(f"EXECUTING AI-SQL: {sql}")
            data = execute_query(sql)
            return build_genui_response(title, data)
        except Exception as e:
            print(f"NL Query Error: {e}")
            # Fallback to a safe default if AI fails
            data = execute_query("SELECT product_name, SUM(quantity_sold_aft_promo) as sales FROM fact_events f JOIN dim_products p ON f.product_code = p.product_code GROUP BY p.product_name ORDER BY sales DESC LIMIT 10")
            return build_genui_response("Top Products (Recovery Mode)", data)

nl_engine = NLQueryEngine()
