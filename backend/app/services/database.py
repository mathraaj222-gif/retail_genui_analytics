from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:cEkmfnrJqVdxvjEMZEEiPCYaWrYzdXYn@gondola.proxy.rlwy.net:17134/railway"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


from decimal import Decimal
from sqlalchemy import text

def execute_query(query):

    with engine.connect() as conn:

        result = conn.execute(text(query))

        data = []

        for row in result:

            row_dict = dict(row._mapping)

            for key, value in row_dict.items():

                if isinstance(value, Decimal):
                    row_dict[key] = round(float(value), 2)

            data.append(row_dict)

        return data

