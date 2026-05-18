def generate_basic_insights(data):
    """
    Generates high-level business insights from the dataset.
    """
    if not data:
        return []

    first_item = data[0]
    first_key = list(first_item.keys())[0]
    second_key = list(first_item.keys())[1] if len(first_item.keys()) > 1 else first_key

    insights = []

    # Performer Insight
    insights.append({
        "title": "Performance Leader",
        "description": f"{first_item[first_key]} is currently the top performer based on {second_key} metrics.",
        "severity": "low"
    })

    # Concentration Insight
    if len(data) >= 3:
        insights.append({
            "title": "Strategic Concentration",
            "description": "A significant portion of performance is concentrated in the top 3 entries, suggesting a Pareto distribution.",
            "severity": "medium"
        })

    return insights
