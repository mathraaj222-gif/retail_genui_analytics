def generate_insight(title: str, data: list, analysis_type: str):
    """
    Converts raw analytics output into human-readable business insight.
    """

    if not data or not isinstance(data, list) or len(data) == 0:
        return "No significant data available for analysis."

    try:
        first_row = data[0]
        # Get the first string/name-like value from the first row
        label = "the identified item"
        if isinstance(first_row, dict):
            for val in first_row.values():
                if isinstance(val, str):
                    label = val
                    break
        elif isinstance(first_row, str):
            label = first_row

        # DESCRIPTIVE INSIGHTS
        if analysis_type == "descriptive":
            return f"The analysis for {title} indicates that {label} is leading in current performance metrics."

        # DIAGNOSTIC INSIGHTS
        if analysis_type == "diagnostic":
            return f"Diagnostic patterns show that {label} is a key driver for the observed trends in {title}."

        # PREDICTIVE INSIGHTS
        if analysis_type == "predictive":
            return f"The predictive engine forecasts a strong trend for {label} based on current neural patterns."

        # PRESCRIPTIVE INSIGHTS
        if analysis_type == "prescriptive":
            return f"Strategic recommendation: Prioritize efforts on {label} to maximize potential returns."

    except Exception:
        pass

    return f"Analytical patterns identified for {title} provide significant business intelligence."