import sqlalchemy
from sqlalchemy import create_engine, func, inspect, text
import pandas as pd

class SQLHelper():

    def __init__(self):
        self.engine = create_engine("sqlite:///Resources/tornados.sqlite")

    def getMapData(self, region):
        # allow the user to select ALL or a specific region
        if region == "All":
            where_clause = "1=1"
        else:
            where_clause = f"region = '{region}'"

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

    def getBarData(self, region):
        # allow the user to select ALL or a specific region
        if region == "All":
            where_clause = "1=1"
        else:
            where_clause = f"region = '{region}'"

        query = f"""
            SELECT
                st as state,
                count(*) as num_tornados
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

    def getBoxData(self, region):
        # allow the user to select ALL or a specific region
        if region == "All":
            where_clause = "1=1"
        else:
            where_clause = f"region = '{region}'"

        query = f"""
            SELECT
                month,
                region,
                mag as magnitude
            FROM
                tornados
            WHERE
                {where_clause};
        """

        df_box = pd.read_sql(text(query), con=self.engine)
        data_box = df_box.to_dict(orient="records")

        return(data_box)
        # print(data_line)

    def getSunburstData(self, region):
        # allow the user to select ALL or a specific region
        if region == "All":
            where_clause = "1=1"
        else:
            where_clause = f"region = '{region}'"

        query = f"""
            SELECT
                region as label,
                "" as parent,
                count(*) as num_tornados
            FROM
                tornados
            WHERE
                {where_clause}
            GROUP BY
                region
            
            UNION ALL 

            SELECT
                st as label,
                region as parent,
                count(*) as num_tornados
            FROM
                tornados
            WHERE
                {where_clause}
            GROUP BY
                st,
                region;
        """

        df_sunburst = pd.read_sql(text(query), con=self.engine)
        data_sunburst = df_sunburst.to_dict(orient="records")

        return(data_sunburst)