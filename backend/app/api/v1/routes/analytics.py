from fastapi import APIRouter
from app.services.analytics.engine import (
    get_revenue_intelligence,
    get_promotion_effectiveness,
    get_product_quadrant,
    get_executive_kpis,
    get_top_products,
    get_campaign_performance,
    get_category_performance,
    demand_forecasting,
    get_prescriptive_analysis
)
from app.services.ai.autonomous_agent import agent

router = APIRouter()

# =========================================
# ANALYTICS ENDPOINTS
# =========================================

@router.get("/descriptive/top-products")
def route_top_products():
    return get_top_products()

@router.get("/descriptive/campaign-performance")
def route_campaign_performance():
    return get_campaign_performance()

@router.get("/descriptive/category-performance")
def route_category_performance():
    return get_category_performance()

@router.get("/predictive/demand-forecast")
def route_demand_forecast():
    return demand_forecasting()

@router.get("/prescriptive/recommendations")
def route_prescriptive_recommendations():
    return get_prescriptive_analysis()


@router.get("/metrics/revenue-intelligence")
def route_revenue_intelligence():
    return get_revenue_intelligence()

@router.get("/metrics/promotion-effectiveness")
def route_promotion_effectiveness():
    return get_promotion_effectiveness()

@router.get("/metrics/product-quadrant")
def route_product_quadrant():
    return get_product_quadrant()

@router.get("/metrics/executive-kpis")
def route_executive_kpis():
    return get_executive_kpis()

# =========================================
# AUTONOMOUS AI AGENT (GENUI)
# =========================================

class QueryRequest(dict):
    prompt: str

@router.post("/autonomous/query")
def autonomous_query(request: dict):
    prompt = request.get("prompt")
    return agent.process_request(prompt)

from app.services.analytics.engine import (
    get_top_stores_ir, get_bottom_stores_isu, get_city_performance, get_store_characteristics,
    get_top_promotions_ir, get_bottom_promotions_isu, get_promotion_comparison, get_promotion_margin_balance,
    get_category_lift, get_product_response_analysis, get_category_promo_correlation
)

@router.get("/store-performance/top-ir")
def route_top_stores_ir(): return get_top_stores_ir()

@router.get("/store-performance/bottom-isu")
def route_bottom_stores_isu(): return get_bottom_stores_isu()

@router.get("/store-performance/city-analysis")
def route_city_performance(): return get_city_performance()

@router.get("/store-performance/store-characteristics")
def route_store_characteristics(): return get_store_characteristics()

@router.get("/promotion/top-ir")
def route_top_promotions_ir(): return get_top_promotions_ir()

@router.get("/promotion/bottom-isu")
def route_bottom_promotions_isu(): return get_bottom_promotions_isu()

@router.get("/promotion/comparison")
def route_promotion_comparison(): return get_promotion_comparison()

@router.get("/promotion/margin-balance")
def route_promotion_margin_balance(): return get_promotion_margin_balance()

@router.get("/product/category-lift")
def route_category_lift(): return get_category_lift()

@router.get("/product/response-analysis")
def route_product_response_analysis(): return get_product_response_analysis()

@router.get("/product/category-promo-correlation")
def route_category_promo_correlation(): return get_category_promo_correlation()
