from app.services.ai.agents.base_agent import BaseAgent
from constants.promotions import PROMO_TYPES, CITIES, CATEGORIES, CAMPAIGNS, PRODUCTS
from app.services.database import execute_query

class SQLAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Senior Postgres SQL Architect",
            goal="Generate high-performance, accurate SQL queries for retail analytics. Self-heal if errors occur."
        )

    def generate_sql(self, nlu_data: dict, retry_context: str = None):
        prompt = f"""
        NLU Context: {nlu_data}
        
        Generate a Postgres SQL query based on the corrected query and mapped columns.
        
        VALID SCHEMA (ONLY USE THESE COLUMNS):
        - fact_events (f): event_id, store_id, campaign_id, product_code, base_price, promo_type, quantity_sold_bfr_promo, quantity_sold_aft_promo
        - dim_products (p): product_code, product_name (NOT 'name'), category
        - dim_campaigns (c): campaign_id, campaign_name, start_date, end_date
        - dim_stores (s): store_id, city
        
        VALID DOMAIN VALUES (Filter by these using exact spelling & case matches in SQL):
        - promo_type values: {PROMO_TYPES}
        - city values: {CITIES}
        - category values: {CATEGORIES}
        - campaign_name values: {CAMPAIGNS}
        - product_name values: {PRODUCTS}
        
        STRICT RULES:
        1. 'promo_type' is in fact_events (f).
        2. 'product_name' is the column in dim_products (p). NEVER use 'p.name'.
        3. For 'Sales', use SUM(f.quantity_sold_aft_promo).
        4. For 'Uplift', use SUM(f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo).
        5. NEVER use single quotes for aliases. Use double quotes if needed (e.g., AS "Uplift") or just plain text (e.g., AS uplift).
        6. Always JOIN on product_code, store_id, and campaign_id.
        
        {f"CRITICAL ERROR FIX: The previous SQL failed: {retry_context}. DO NOT repeat this error." if retry_context else ""}
        
        Respond with JSON: {{"sql": "string", "explanation": "string"}}
        """
        return self.call_llm(prompt)

    def execute_and_validate(self, sql: str, nlu_data: dict, max_retries: int = 2):
        retries = 0
        current_sql = sql
        
        while retries <= max_retries:
            if not current_sql:
                print("SQL Agent: No SQL generated, retrying...")
                healing_response = self.generate_sql(nlu_data, retry_context="No SQL was generated or JSON was malformed.")
                current_sql = healing_response.get("sql")
                retries += 1
                continue

            try:
                data = execute_query(current_sql)
                return {"data": data, "sql": current_sql, "status": "success"}
            except Exception as e:
                retries += 1
                if retries > max_retries:
                    return {"status": "error", "message": str(e), "sql": current_sql}
                
                print(f"SQL Agent: Healing query... Error: {e}")
                healing_response = self.generate_sql(nlu_data, retry_context=str(e))
                current_sql = healing_response.get("sql")
        
        return {"status": "error", "message": "Max retries exceeded"}
