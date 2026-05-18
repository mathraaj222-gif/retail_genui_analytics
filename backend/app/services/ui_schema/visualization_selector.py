def select_chart_type(data):
    """
    Heuristically determines the best chart type based on data dimensions.
    """
    if not data:
        return "bar"

    first_row = data[0]
    total_columns = len(first_row.keys())
    numeric_columns = []

    for key, value in first_row.items():
        if isinstance(value, (int, float)):
            numeric_columns.append(key)

    # 1. Two columns (Category + Value) -> Bar Chart
    if total_columns == 2:
        if len(numeric_columns) == 1:
            return "bar"

    # 2. Multiple numeric trends -> Line Chart
    if len(numeric_columns) >= 2:
        return "line"

    # 3. Categorical distribution -> Pie Chart
    return "pie"
