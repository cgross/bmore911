package com.schtoo.bmore911;

import org.jooq.DSLContext;
import org.jooq.ResultQuery;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QueryCreatorTest {

    private QueryCreator qc = new QueryCreator(500);
    private DSLContext create = DSL.using(SQLDialect.POSTGRES);

    @Test
    public void noParams() {

        Map<String,String[]> params = new HashMap<>();

        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls limit ?");
        Assert.assertEquals(values, Arrays.asList(500));
    }

    @Test
    public void oneParam() {

        Map<String,String[]> params = new HashMap<>();
        params.put("district",new String[]{"nw"});

        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls where district ilike ? limit ?");
        Assert.assertEquals(values, Arrays.asList("%nw%",500));
    }

    @Test
    public void allParams() {

        Map<String,String[]> params = new HashMap<>();
        params.put("calldatetime",new String[]{"1"});
        params.put("priority",new String[]{"2"});
        params.put("district",new String[]{"3"});
        params.put("description",new String[]{"4"});
        params.put("callnumber",new String[]{"5"});
        params.put("incidentlocation",new String[]{"6"});

        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls where (calldatetime ilike ? and priority ilike ? and " +
                "district ilike ? and description ilike ? and callnumber ilike ? and incidentlocation ilike ?) limit ?");
        Assert.assertEquals(values, Arrays.asList("%1%","%2%","%3%","%4%","%5%","%6%",500));
    }

    @Test
    public void allParamsOneExtra() {

        Map<String,String[]> params = new HashMap<>();
        params.put("calldatetime",new String[]{"1"});
        params.put("priority",new String[]{"2"});
        params.put("district",new String[]{"3"});
        params.put("description",new String[]{"4"});
        params.put("callnumber",new String[]{"5"});
        params.put("incidentlocation",new String[]{"6"});
        params.put("extra",new String[]{"7"});

        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls where (calldatetime ilike ? and priority ilike ? and " +
                "district ilike ? and description ilike ? and callnumber ilike ? and incidentlocation ilike ?) limit ?");
        Assert.assertEquals(values, Arrays.asList("%1%","%2%","%3%","%4%","%5%","%6%",500));
    }

    @Test
    public void orderByNoWhere() {

        Map<String,String[]> params = new HashMap<>();
        params.put("orderBy",new String[]{"district"});


        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls order by district asc limit ?");
        Assert.assertEquals(values, Arrays.asList(500));
    }

    @Test
    public void orderByNoWhereDesc() {

        Map<String,String[]> params = new HashMap<>();
        params.put("orderBy",new String[]{"district"});
        params.put("orderByDesc",new String[]{"true"});


        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls order by district desc limit ?");
        Assert.assertEquals(values, Arrays.asList(500));
    }

    @Test
    public void orderByWithWhere() {

        Map<String,String[]> params = new HashMap<>();
        params.put("orderBy",new String[]{"district"});
        params.put("district",new String[]{"nw"});


        ResultQuery query = qc.createQuery(create,params);
        String sql = query.getSQL();
        List<Object> values = query.getBindValues();

        Assert.assertEquals(sql,"select * from calls where district ilike ? order by district asc limit ?");
        Assert.assertEquals(values, Arrays.asList("%nw%",500));
    }

}