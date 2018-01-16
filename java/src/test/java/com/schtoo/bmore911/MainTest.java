package com.schtoo.bmore911;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import spark.Spark;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MainTest {

    @BeforeClass
    public static void setup() {
        new Main().start(10);
        Spark.awaitInitialization();
    }

    @AfterClass
    public static void tearDown() {
        Spark.stop();
    }

    private List<Map<String,Object>> getResponse(Map<String,String> params) {
        try {

            String queryString = params.keySet().stream().map(k -> k + "=" + params.get(k))
                    .collect(Collectors.joining("&"));

            URL url = new URL("http://localhost:3001/data?" + queryString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            if (connection.getResponseCode() != 200) {
                return null;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> list  = objectMapper.readValue(connection.getInputStream(),
                    new TypeReference<List<Map<String, Object>>>(){});

            return list;

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Test
    public void basic() {
        Map<String,String> params = new HashMap<>();
        List results = getResponse(params);
        Assert.assertNotNull("No results from REST call.",results);
    }

    @Test
    public void filtering() {
        Map<String,String> params = new HashMap<>();
        params.put("priority","low");

        List<Map<String,Object>> results = getResponse(params);

        Assert.assertNotNull("No results from REST call.",results);

        results.forEach(r -> {
            Assert.assertEquals("Result has unexpected priority after filtering.","Low",r.get("priority"));
        });
    }

    @Test
    public void sorting() {
        Map<String,String> params = new HashMap<>();
        params.put("orderBy","priority");

        List<Map<String,Object>> results = getResponse(params);

        Assert.assertNotNull("No results from REST call.",results);

        results.forEach(r -> {
            Assert.assertEquals("Result has unexpected priority after sorting.","Emergency",r.get("priority"));
        });
    }

    @Test
    public void sortingDescending() {
        Map<String,String> params = new HashMap<>();
        params.put("orderBy","priority");
        params.put("orderByDesc","true");

        List<Map<String,Object>> results = getResponse(params);

        Assert.assertNotNull("No results from REST call.",results);

        results.forEach(r -> {
            Assert.assertEquals("Result has unexpected priority after sorting.","Out of Service",r.get("priority"));
        });
    }

}
