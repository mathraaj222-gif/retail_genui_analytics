from app.services.ui_schema.schema_builder import build_visualization_schema
from app.services.insights.insight_generator import generate_basic_insights

def build_genui_response(title, data):
    """
    Constructs a full GenUI response, combining visualization schemas, 
    raw data, and AI-generated insights.
    """
    schema = build_visualization_schema(title, data)
    insights = generate_basic_insights(data)

    return {
        "schema": schema,
        "data": data,
        "insights": insights
    }
