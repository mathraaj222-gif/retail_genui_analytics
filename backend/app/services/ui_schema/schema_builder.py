from app.services.ui_schema.visualization_selector import select_chart_type

def build_visualization_schema(title, data, chart_type=None, xKey=None, yKey=None):
    """Constructs a frontend-ready visualization schema."""
    if not data:
        return {"type": "bar", "title": title, "xKey": "", "yKey": ""}

    first_row = data[0]
    columns = list(first_row.keys())
    
    # Use provided keys or default to the first two columns
    final_x = xKey or columns[0]
    final_y = yKey or (columns[1] if len(columns) > 1 else columns[0])
    
    if not chart_type:
        chart_type = select_chart_type(data)

    return {
        "type": chart_type,
        "title": title,
        "xKey": final_x,
        "yKey": final_y
    }

def build_genui_response(schema_type, data, title, insights=None, xKey=None, yKey=None):
    """
    Standardized orchestrator for GenUI responses.
    Combines Schema, Data, and Strategic Insights.
    """
    return {
        "schema": build_visualization_schema(title, data, chart_type=schema_type, xKey=xKey, yKey=yKey),
        "data": data,
        "insights": insights or []
    }
