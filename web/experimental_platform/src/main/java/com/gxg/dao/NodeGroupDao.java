package com.gxg.dao;

import com.gxg.entities.NodeGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.w3c.dom.NodeList;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

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

    public int getCountByUserIp(String userIp) {
        String sql = "select count(*) from NodeGroup where userIp=?";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class, userIp);
        return rowCount;
    }

    public NodeGroup getNodeGroupByUserIp(String userIp) {
        String sql = "select * from NodeGroup where userIp=?";
        NodeGroup nodeGroup = jdbcTemplate.queryForObject(sql, new RowMapper<NodeGroup>() {
            @Override
            public NodeGroup mapRow(ResultSet resultSet, int i) throws SQLException {
                NodeGroup nodeGroup = new NodeGroup();
                nodeGroup.setGroupNumber(resultSet.getInt("groupNumber"));
                nodeGroup.setUserIp(resultSet.getString("userIp"));
                nodeGroup.setTime(resultSet.getTimestamp("time"));
                return nodeGroup;
            }
        }, userIp);
        return nodeGroup;
    }

    public int getCountByUserIpIsNull() {
        String sql = "select count(*) from NodeGroup where userIp is null";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    public List<NodeGroup> getNodeGroupByUserIpIsNull() {
        String sql = "select * from NodeGroup where userIp is null";
        List<NodeGroup> nodeGroupList = jdbcTemplate.query(sql, new RowMapper<NodeGroup>() {
            @Override
            public NodeGroup mapRow(ResultSet resultSet, int i) throws SQLException {
                NodeGroup nodeGroup = new NodeGroup();
                nodeGroup.setGroupNumber(resultSet.getInt("groupNumber"));
                nodeGroup.setUserIp(resultSet.getString("userIp"));
                nodeGroup.setTime(resultSet.getTimestamp("time"));
                return nodeGroup;
            }
        });
        return nodeGroupList;
    }

    public void updateTimeByUserIp(String userIp) {
        String sql = "update NodeGroup set time=? where userIp=?";
        Timestamp time = new Timestamp(System.currentTimeMillis());//获取当前系统时间
        jdbcTemplate.update(sql, time, userIp);
    }
    public void setUserIpAndTimeNullByGroupNumber(int groupNumber) {
        String sql = "update NodeGroup set userIp=null, time=null where groupNumber=?";
        jdbcTemplate.update(sql, groupNumber);
    }

    public int getCountByUserIpNotNull() {
        String sql = "select count(*) from NodeGroup where userIp is not null";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    public List<NodeGroup> getNodeGroupByUserIpNotNull() {
        String sql = "select * from NodeGroup where userIp is not null";
        List<NodeGroup> nodeGroupList = jdbcTemplate.query(sql, new RowMapper<NodeGroup>() {
            @Override
            public NodeGroup mapRow(ResultSet resultSet, int i) throws SQLException {
                NodeGroup nodeGroup = new NodeGroup();
                nodeGroup.setGroupNumber(resultSet.getInt("groupNumber"));
                nodeGroup.setUserIp(resultSet.getString("userIp"));
                nodeGroup.setTime(resultSet.getTimestamp("time"));
                return nodeGroup;
            }
        });
        return nodeGroupList;
    }

    public void setUserIpByGroupNumber(String userIp, int groupNumber) {
        String sql = "update NodeGroup set userIp=? where groupNumber=?";
        jdbcTemplate.update(sql, userIp, groupNumber);
    }

    public void setUserIpAndTimeByGroupNumber(String userIp, Timestamp time, int groupNumber) {
        String sql = "update NodeGroup set userIp=?, time=? where groupNumber=?";
        jdbcTemplate.update(sql, userIp, time, groupNumber);
    }
}
