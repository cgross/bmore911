package com.schtoo.bmore911;

import org.jooq.DSLContext;
import org.jooq.ResultQuery;
import org.jooq.SelectJoinStep;
import org.jooq.impl.DSL;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class QueryCreator {

    private static List<String> columns = Arrays.asList("calldatetime","priority","district",
            "description","callnumber","incidentlocation");

    private static List<String> orderByColumns = Arrays.asList("calldatetime","priority","district",
            "description","callnumber","incidentlocation","calldatetime2");

    private int queryLimit;

    public QueryCreator(int queryLimit) {
        this.queryLimit = queryLimit;
    }

    public ResultQuery createQuery(DSLContext create, Map<String, String[]> params) {
        SelectJoinStep query = create.select().from("calls");

        columns.forEach(c -> {
            if (params.containsKey(c)) {
                query.where(DSL.field(c).likeIgnoreCase("%"+params.get(c)[0]+"%"));
            }
        });

        if (params.containsKey("orderBy")) {
            String orderBy = params.get("orderBy")[0];
            if (params.containsKey("orderByDesc")) {
                query.orderBy(DSL.field(orderBy).desc());
            } else {
                query.orderBy(DSL.field(orderBy).asc());
            }
        }

        return query.limit(queryLimit);
    }

}
