package com.gxg.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Created by 郭欣光 on 2018/6/14.
 */

@Repository
public class NodeCountDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int getCount() {
        String sql = "select count(*) from NodeCount";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    public void addNodeCount(int id, int count) {
        String sql = "insert into NodeCount values(?, ?)";
        jdbcTemplate.update(sql, id, count);
    }

    public int getNodeCount() {
        String sql ="select count from NodeCount where id=1";
        int count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count;
    }

    public void updateNodeCount(int nodeCount) {
        String sql = "update NodeCount set count=? where id=1";
        jdbcTemplate.update(sql, nodeCount);
    }
}
