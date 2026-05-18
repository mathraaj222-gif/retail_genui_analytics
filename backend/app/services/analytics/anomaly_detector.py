import pandas as pd
from app.services.database import execute_query

def detect_anomalies():
    """
    Identifies statistical deviations in sales performance.
    """
    query = "SELECT product_code, quantity_sold_aft_promo FROM fact_events"
    data = execute_query(query)
    df = pd.DataFrame(data)
    
    if df.empty: return []

    mean = df['quantity_sold_aft_promo'].mean()
    std = df['quantity_sold_aft_promo'].std()
    
    # 2-Sigma Anomaly Detection
    anomalies = df[df['quantity_sold_aft_promo'] > (mean + 2 * std)]
    
    return anomalies.to_dict('records')

def analyze_trends():
    """
    Detects growth or decline patterns.
    """
    query = """
    SELECT p.category, SUM(f.quantity_sold_aft_promo) as sales, SUM(f.quantity_sold_bfr_promo) as baseline
    FROM fact_events f JOIN dim_products p ON f.product_code = p.product_code
    GROUP BY p.category
    """
    data = execute_query(query)
    results = []
    for row in data:
        growth = ((row['sales'] - row['baseline']) / row['baseline']) * 100 if row['baseline'] > 0 else 0
        results.append({
            "category": row['category'],
            "growth_percent": round(growth, 2),
            "status": "Trending Up" if growth > 5 else "Stable"
        })
    return results
