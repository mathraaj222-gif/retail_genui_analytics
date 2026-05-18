import pandas as pd
from sqlalchemy import create_engine
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Database Connection (Standardized)
DATABASE_URL = "postgresql://postgres:cEkmfnrJqVdxvjEMZEEiPCYaWrYzdXYn@gondola.proxy.rlwy.net:17134/railway"
engine = create_engine(DATABASE_URL)

def get_training_data():
    """Simple data loader for the ML models."""
    query = """
    SELECT f.base_price, f.promo_type, f.quantity_sold_bfr_promo, f.quantity_sold_aft_promo, p.category
    FROM fact_events f JOIN dim_products p ON f.product_code = p.product_code;
    """
    return pd.read_sql(query, engine)

class SalesPredictor:
    """The core ML engine for Retail Analytics."""
    def __init__(self):
        self.features = ['base_price', 'promo_type', 'quantity_sold_bfr_promo', 'category']
        self.model = Pipeline(steps=[
            ('preprocessor', ColumnTransformer(transformers=[
                ('num', 'passthrough', ['base_price', 'quantity_sold_bfr_promo']),
                ('cat', OneHotEncoder(handle_unknown='ignore'), ['promo_type', 'category'])
            ])),
            ('regressor', RandomForestRegressor(n_estimators=100))
        ])

    def predict(self, input_data):
        df = get_training_data()
        self.model.fit(df[self.features], df['quantity_sold_aft_promo'])
        return self.model.predict(pd.DataFrame([input_data]))[0]

# Single instance for the app to use
model = SalesPredictor()
