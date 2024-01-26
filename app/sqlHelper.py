import sqlalchemy
from sqlalchemy import create_engine, func, inspect, text
import pandas as pd

class SQLHelper():

    def __init__(self):
        self.engine = create_engine("sqlite:///Resources/tornados.sqlite")

    def getMapData(self, state):
        # allow the user to select ALL or a specific state
        if state == "All":
            where_clause = "1=1"
        else:
            where_clause = f"state = '{state}'"

        # USE RAW SQL
        query = f"""
                SELECT
                    *
                FROM
                    tornados
                WHERE
                    {where_clause};
        """

        df_map = pd.read_sql(text(query), con=self.engine)
        data_map = df_map.to_dict(orient="records")

        return(data_map)

    def getBarData(self, state):
        # allow the user to select ALL or a specific state
        if state == "All":
            where_clause = "1=1"
        else:
            where_clause = f"state = '{state}'"

        query = f"""
            SELECT
                st as state,
                count(*) as num_tornados,
                mo
            FROM
                tornados
            WHERE
                {where_clause}
            GROUP BY
                location,
                state
            ORDER BY
                num_tornados desc;
        """

        df_bar = pd.read_sql(text(query), con=self.engine)
        data_bar = df_bar.to_dict(orient="records")

        return(data_bar)

    def getLineData(self, state):
        # allow the user to select ALL or a specific state
        if state == "All":
            where_clause = "1=1"
        else:
            where_clause = f"state = '{state}'"

        query = f"""
            SELECT
                st as state,
                mag as magnitude,
                mo as month,
                count(*) as num_tornados
            FROM
                tornados
            WHERE
                {where_clause}
            GROUP BY
                state,
                magnitude
            ORDER BY
                state asc;
        """

        df_line = pd.read_sql(text(query), con=self.engine)
        data_line = df_line.to_dict(orient="records")

        return(data_line)