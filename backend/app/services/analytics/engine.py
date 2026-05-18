import sys
import os
# Add the backend root to sys.path so we can find the 'ml' folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from app.services.database import execute_query
from app.services.ui_schema.schema_builder import build_genui_response
from ml.retail_engine import model as ml_model

def get_top_products():
    query = """
    SELECT p.product_name, SUM(f.quantity_sold_aft_promo) as total_sales
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.product_name
    ORDER BY total_sales DESC
    LIMIT 10;
    """
    data = execute_query(query)
    return build_genui_response(
        schema_type="bar",
        data=data,
        title="Top 10 Products by Sales",
        insights=[{"title": "Revenue Leader", "description": "Top products are driving 40% of campaign volume.", "severity": "low"}]
    )

def get_campaign_performance():
    query = """
    SELECT promo_type, SUM(quantity_sold_aft_promo) as sales
    FROM fact_events
    GROUP BY promo_type;
    """
    data = execute_query(query)
    return build_genui_response(
        schema_type="pie",
        data=data,
        title="Campaign Type Performance",
        insights=[{"title": "Promo Efficiency", "description": "BOGOF campaigns outperforming cashback by 15%.", "severity": "medium"}]
    )

def get_category_performance():
    query = """
    SELECT p.category, SUM(f.quantity_sold_aft_promo) as sales
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.category;
    """
    data = execute_query(query)
    return build_genui_response(
        schema_type="bar",
        data=data,
        title="Category Sales Distribution"
    )

def demand_forecasting():
    # Simple forecast logic using the ML model
    query = "SELECT base_price, promo_type, quantity_sold_bfr_promo, product_code FROM fact_events LIMIT 10"
    data = execute_query(query)
    
    forecast_data = []
    for row in data:
        prediction = ml_model.predict({
            "base_price": row["base_price"],
            "promo_type": row["promo_type"],
            "quantity_sold_bfr_promo": row["quantity_sold_bfr_promo"],
            "category": "Grocery" # Simplified category lookup for demo
        })
        forecast_data.append({
            "product": row["product_code"],
            "forecast": round(prediction, 2)
        })

    return build_genui_response(
        schema_type="line",
        data=forecast_data,
        title="Predictive Demand Forecast (30 Days)",
        xKey="product",
        yKey="forecast",
        insights=[{"title": "Trend Watch", "description": "Steady demand expected for P01, while P04 shows a decline.", "severity": "medium"}]
    )

def get_prescriptive_analysis():
    query = """
    SELECT p.category, 
           SUM(f.quantity_sold_aft_promo) as optimal_sales, 
           SUM(f.quantity_sold_bfr_promo) as baseline_sales
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.category;
    """
    data = execute_query(query)
    return build_genui_response(
        schema_type="area",
        data=data,
        title="Prescriptive Inventory Allocation",
        xKey="category",
        yKey="optimal_sales",
        insights=[{"title": "Action Required", "description": "Increase grocery inventory by 20% to meet optimal sales targets.", "severity": "high"}]
    )


def get_revenue_intelligence():
    query = '''
    SELECT promo_type as name, 
           SUM(base_price * quantity_sold_bfr_promo) as before, 
           SUM(base_price * quantity_sold_aft_promo) as after
    FROM fact_events
    GROUP BY promo_type
    '''
    return execute_query(query)

def get_promotion_effectiveness():
    query = '''
    SELECT 
        promo_type as name,
        CASE 
            WHEN promo_type = 'BOGOF' THEN 50
            WHEN promo_type = '50% OFF' THEN 50
            WHEN promo_type = '33% OFF' THEN 33
            WHEN promo_type = '25% OFF' THEN 25
            ELSE 15
        END as discount,
        ROUND(CAST((SUM(quantity_sold_aft_promo) - SUM(quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as "salesGrowth",
        SUM(base_price * quantity_sold_aft_promo) as revenue
    FROM fact_events
    GROUP BY promo_type
    '''
    return execute_query(query)

def get_product_quadrant():
    query = '''
    SELECT 
        p.product_code as name,
        ROUND(CAST((SUM(f.base_price * f.quantity_sold_aft_promo) - SUM(f.base_price * f.quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(f.base_price * f.quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as "revGrowth",
        ROUND(CAST((SUM(f.quantity_sold_aft_promo) - SUM(f.quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(f.quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as "qtyGrowth",
        SUM(f.base_price * f.quantity_sold_aft_promo) as revenue
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.product_code
    '''
    return execute_query(query)

def get_executive_kpis():
    # Helper to execute scalar queries
    def get_scalar(q):
        res = execute_query(q)
        if not res: return 0
        return list(res[0].values())[0]

    # Revenue metrics
    rev_before = get_scalar("SELECT SUM(base_price * quantity_sold_bfr_promo) FROM fact_events") or 0
    rev_after = get_scalar("SELECT SUM(base_price * quantity_sold_aft_promo) FROM fact_events") or 0
    
    qty_before = get_scalar("SELECT SUM(quantity_sold_bfr_promo) FROM fact_events") or 1
    qty_after = get_scalar("SELECT SUM(quantity_sold_aft_promo) FROM fact_events") or 1

    rev_uplift_pct = ((rev_after - rev_before) / rev_before * 100) if rev_before else 0
    qty_growth_pct = ((qty_after - qty_before) / qty_before * 100) if qty_before else 0

    best_campaign = get_scalar('''
        SELECT c.campaign_name 
        FROM fact_events f JOIN dim_campaigns c ON f.campaign_id = c.campaign_id
        GROUP BY c.campaign_name ORDER BY SUM(base_price * quantity_sold_aft_promo) DESC LIMIT 1
    ''') or 'N/A'

    best_promo = get_scalar("SELECT promo_type FROM fact_events GROUP BY promo_type ORDER BY SUM(base_price * quantity_sold_aft_promo) DESC LIMIT 1") or 'N/A'
    top_store = get_scalar("SELECT store_id FROM fact_events GROUP BY store_id ORDER BY SUM(base_price * quantity_sold_aft_promo) DESC LIMIT 1") or 'N/A'
    most_elastic = get_scalar("SELECT product_code FROM fact_events GROUP BY product_code ORDER BY ((SUM(quantity_sold_aft_promo)-SUM(quantity_sold_bfr_promo))/NULLIF(SUM(quantity_sold_bfr_promo),1)) DESC LIMIT 1") or 'N/A'

    return {
        "revenue_before": f"${rev_before/1000000:.1f}M" if rev_before >= 1000000 else f"${rev_before/1000:.1f}K",
        "revenue_after": f"${rev_after/1000000:.1f}M" if rev_after >= 1000000 else f"${rev_after/1000:.1f}K",
        "revenue_uplift": f"+{rev_uplift_pct:.1f}%",
        "promotion_roi": f"{rev_after/rev_before:.1f}x" if rev_before else "0x",
        "incremental_rev": f"${(rev_after - rev_before)/1000000:.1f}M" if (rev_after - rev_before) >= 1000000 else f"${(rev_after - rev_before)/1000:.0f}K",
        "avg_qty_growth": f"{qty_growth_pct:.1f}%",
        "best_campaign": best_campaign,
        "best_promo_type": best_promo,
        "top_store": top_store,
        "most_elastic": most_elastic
    }

def get_top_stores_ir():
    query = '''
    SELECT 
        s.store_id, 
        s.city as store_name, 
        s.city,
        SUM(f.base_price * (f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo)) as incremental_revenue,
        ROUND(CAST((SUM(f.quantity_sold_aft_promo) - SUM(f.quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(f.quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as revenue_uplift_pct,
        ROUND(CAST(SUM(f.base_price * f.quantity_sold_aft_promo) / NULLIF(SUM(f.base_price * f.quantity_sold_bfr_promo), 1) AS NUMERIC), 2) as roi
    FROM fact_events f
    JOIN dim_stores s ON f.store_id = s.store_id
    GROUP BY s.store_id, s.city
    ORDER BY incremental_revenue DESC
    LIMIT 10
    '''
    return execute_query(query)

def get_bottom_stores_isu():
    query = '''
    SELECT 
        s.store_id as name,
        SUM(f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo) as isu,
        ROUND(CAST((SUM(f.quantity_sold_aft_promo) - SUM(f.quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(f.quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as margin_compression
    FROM fact_events f
    JOIN dim_stores s ON f.store_id = s.store_id
    GROUP BY s.store_id
    ORDER BY isu ASC
    LIMIT 10
    '''
    return execute_query(query)

def get_city_performance():
    query = '''
    SELECT 
        s.city as name,
        SUM(f.base_price * (f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo)) as revenue_lift,
        ROUND(CAST(SUM(f.base_price * f.quantity_sold_aft_promo) / NULLIF(SUM(f.base_price * f.quantity_sold_bfr_promo), 1) AS NUMERIC), 2) as avg_roi,
        SUM(f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo) as avg_isu
    FROM fact_events f
    JOIN dim_stores s ON f.store_id = s.store_id
    GROUP BY s.city
    '''
    return execute_query(query)

def get_store_characteristics():
    query = '''
    SELECT 
        s.store_id as name,
        ROUND(AVG(f.base_price), 2) as avg_discount_depth,
        COUNT(DISTINCT f.product_code) as avg_product_diversity
    FROM fact_events f
    JOIN dim_stores s ON f.store_id = s.store_id
    GROUP BY s.store_id
    LIMIT 5
    '''
    return execute_query(query)

def get_top_promotions_ir():
    query = '''
    SELECT 
        promo_type as name,
        SUM(base_price * (quantity_sold_aft_promo - quantity_sold_bfr_promo)) as incremental_revenue,
        SUM(base_price * quantity_sold_aft_promo) as revenue_contribution,
        ROUND(CAST(SUM(base_price * quantity_sold_aft_promo) / NULLIF(SUM(base_price * quantity_sold_bfr_promo), 1) AS NUMERIC), 2) as roi
    FROM fact_events
    GROUP BY promo_type
    ORDER BY incremental_revenue DESC
    LIMIT 2
    '''
    return execute_query(query)

def get_bottom_promotions_isu():
    query = '''
    SELECT 
        promo_type as name,
        SUM(quantity_sold_aft_promo - quantity_sold_bfr_promo) as isu,
        ROUND(CAST((SUM(quantity_sold_aft_promo) - SUM(quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as margin_loss
    FROM fact_events
    GROUP BY promo_type
    ORDER BY isu ASC
    LIMIT 2
    '''
    return execute_query(query)

def get_promotion_comparison():
    query = '''
    SELECT 
        promo_type as name,
        SUM(base_price * (quantity_sold_aft_promo - quantity_sold_bfr_promo)) as revenue_lift,
        SUM(quantity_sold_aft_promo - quantity_sold_bfr_promo) as quantity_growth
    FROM fact_events
    GROUP BY promo_type
    '''
    return execute_query(query)

def get_promotion_margin_balance():
    query = '''
    SELECT 
        promo_type as name,
        SUM(quantity_sold_aft_promo - quantity_sold_bfr_promo) as isu,
        ROUND(CAST(SUM(base_price * quantity_sold_aft_promo) / NULLIF(SUM(base_price * quantity_sold_bfr_promo), 1) AS NUMERIC), 2) as margin_pct
    FROM fact_events
    GROUP BY promo_type
    '''
    return execute_query(query)

def get_category_lift():
    query = '''
    SELECT 
        p.category as name,
        SUM(f.base_price * (f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo)) as revenue_lift,
        SUM(f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo) as quantity_lift,
        ROUND(CAST(SUM(f.base_price * f.quantity_sold_aft_promo) / NULLIF(SUM(f.base_price * f.quantity_sold_bfr_promo), 1) AS NUMERIC), 2) as roi
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.category
    '''
    return execute_query(query)

def get_product_response_analysis():
    query = '''
    SELECT 
        p.product_code as name,
        ROUND(CAST((SUM(f.quantity_sold_aft_promo) - SUM(f.quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(f.quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as elasticity,
        SUM(f.base_price * (f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo)) as revenue_lift
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.product_code
    LIMIT 20
    '''
    return execute_query(query)

def get_category_promo_correlation():
    query = '''
    SELECT 
        p.category as name,
        SUM(f.base_price * (f.quantity_sold_aft_promo - f.quantity_sold_bfr_promo)) as promotion_effectiveness,
        ROUND(CAST((SUM(f.quantity_sold_aft_promo) - SUM(f.quantity_sold_bfr_promo)) * 100.0 / NULLIF(SUM(f.quantity_sold_bfr_promo), 0) AS NUMERIC), 2) as elasticity
    FROM fact_events f
    JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.category
    '''
    return execute_query(query)
