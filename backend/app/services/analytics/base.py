from app.services.analytics.insight_generator import generate_insight
from app.services.ui_schema.visualization_selector import select_visualization

def build_response(analysis_type, title, data, metadata=None):
    """
    Orchestrates the final GenUI response by combining data, AI insights, and UI schemas.
    """
    insight = generate_insight(title, data, analysis_type)
    visualization = select_visualization(data)

    return {
        "analysis_type": analysis_type,
        "title": title,
        "insight": insight,
        "visualization": visualization,
        "data": data,
        "metadata": metadata or {}
    }