package com.schtoo.bmore911;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jooq.*;
import org.jooq.impl.DSL;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;

import static spark.Spark.get;
import static spark.Spark.port;

public class Main {
    public static void main(String[] args) {
        new Main().start(500);
    }

    public void start(int queryLimit) {
        //staticFiles.location("public");
        port(3001);

        String configFilename = System.getProperty("user.dir") + "/../config.json";
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> map  = null;
        try {
            map = objectMapper.readValue(new File(configFilename), new TypeReference<Map<String, String>>(){});
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        String userName = (String) map.get("dbuser");
        String password = (String) map.get("dbpw");
        String dbport = (String) map.get("dbport");
        String dbhost = (String) map.get("dbhost");
        String dbname = (String) map.get("dbname");
        String url = "jdbc:postgresql://"+dbhost+":"+dbport+"/" + dbname;

        try {
            Connection conn = DriverManager.getConnection(url, userName, password);
            QueryCreator queryCreator = new QueryCreator(queryLimit);

            get("/data", (req, res) -> {
                DSLContext create = DSL.using(conn, SQLDialect.POSTGRES);

                ResultQuery query = queryCreator.createQuery(create,req.queryMap().toMap());
                Result results = query.fetch();

                JSONFormat jf = new JSONFormat();
                jf = jf.header(false).recordFormat(JSONFormat.RecordFormat.OBJECT);

                res.type("application/json");
                return results.formatJSON(jf);
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
