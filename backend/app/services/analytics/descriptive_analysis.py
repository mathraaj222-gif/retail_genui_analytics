from app.services.database import execute_query
from app.services.ui_schema.component_mapper import build_genui_response

def get_top_products():
    """
    Fetch top products by sales performance.
    """
    query = """
    SELECT p.product_name, SUM(f.quantity_sold_aft_promo) AS total_sales
    FROM fact_events f JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.product_name ORDER BY total_sales DESC LIMIT 10;
    """
    result = execute_query(query)
    return build_genui_response(title="Top Performing Products", data=result)

def get_category_performance():
    query = """
    SELECT p.category, SUM(f.quantity_sold_aft_promo) AS total_sales
    FROM fact_events f JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.category ORDER BY total_sales DESC;
    """
    result = execute_query(query)
    return build_genui_response(title="Category Market Share", data=result)

def get_campaign_performance():
    query = """
    SELECT c.campaign_name, SUM(f.quantity_sold_aft_promo) AS total_sales
    FROM fact_events f JOIN dim_campaigns c ON f.campaign_id = c.campaign_id
    GROUP BY c.campaign_name ORDER BY total_sales DESC;
    """
    result = execute_query(query)
    return build_genui_response(title="Campaign Impact Analysis", data=result)

# Legacy compatibility
def top_selling_products(): return get_top_products()
def category_sales(): return get_category_performance()
def campaign_performance(): return get_campaign_performance()
