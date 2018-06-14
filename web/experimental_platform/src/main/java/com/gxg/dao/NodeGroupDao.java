package com.gxg.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Created by 郭欣光 on 2018/6/8.
 */

@Repository
public class NodeGroupDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void deleteAll() {
        String sql = "delete from NodeGroup";
        jdbcTemplate.update(sql);
    }

    public int getCountByGroupNumber(int groupNumber) {
        String sql = "select count(*) from NodeGroup where groupNumber=?";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class, groupNumber);
        return rowCount;
    }

    public void insertByGroupNumber(int groupNumber) {
        String sql = "insert into NodeGroup values(?, null, null)";
        jdbcTemplate.update(sql, groupNumber);
    }
}
