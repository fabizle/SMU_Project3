import sqlalchemy
from sqlalchemy import create_engine, func, inspect, text
import pandas as pd

class SQLHelper():

    def __init__(self):
        self.engine = create_engine("sqlite:///Resources/tornados.sqlite")

    def getMapData(self, st):
        # allow the user to select ALL or a specific state
        if st == "All":
            where_clause = "1=1"
        else:
            where_clause = f"st = '{st}'"

        # USE RAW SQL
        query = f"""
                SELECT
                    *
                FROM
                    tornados
                WHERE
                    {where_clause};
        """
        # print(query)
        df_map = pd.read_sql(text(query), con=self.engine)
        data_map = df_map.to_dict(orient="records")

        return(data_map)
        # print(data_map)

    def getBarData(self, st):
        # allow the user to select ALL or a specific state
        if st == "All":
            where_clause = "1=1"
        else:
            where_clause = f"st = '{st}'"

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
                st
            ORDER BY
                num_tornados desc;
        """

        df_bar = pd.read_sql(text(query), con=self.engine)
        data_bar = df_bar.to_dict(orient="records")

        return(data_bar)

    def getLineData(self, st):
        # allow the user to select ALL or a specific state
        if st == "All":
            where_clause = "1=1"
        else:
            where_clause = f"st = '{st}'"

        query = f"""
            SELECT
                mo as month,
                st as state,
                AVG(mag) as magnitude
            FROM
                tornados
            WHERE
                {where_clause}
            GROUP BY
                st,
                mo
            ORDER BY
                st asc,
                mo asc;
        """

        df_line = pd.read_sql(text(query), con=self.engine)
        data_line = df_line.to_dict(orient="records")

        return(data_line)
        # print(data_line)