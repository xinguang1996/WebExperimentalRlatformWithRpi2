package com.gxg.dao;

import com.gxg.entities.ExperimentalNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by 郭欣光 on 2017/12/28.
 */

@Repository
public class ExperimentalNodeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 获得空闲节点
     */
    public List<ExperimentalNode> getFreeNode() {

        if(this.getFreeNodeCount() == 0) {
            return null;
        }
        String sql = "select * from ExperimentalNode where userId is null and time is null and status='正常'";

        List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
            @Override
            public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalNode experimentalNode = new ExperimentalNode();
                experimentalNode.setIp(resultSet.getString("ip"));
//                experimentalNode.setUserId(resultSet.getString("userId"));
//                experimentalNode.setDatetime(resultSet.getTimestamp("time"));

                return experimentalNode;
            }
        });

        return experimentalNodeList;
    }

    /**
     * 获得空闲节点的个数
     */
    public int getFreeNodeCount() {
        String sql = "select count(*) from ExperimentalNode where userId is null and time is null and status='正常'";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }


    /**
     * 将某个节点交给用户
     */
    public void increaseNodeUser(String ip, String userId) {
        String sql = "update ExperimentalNode set userId=?, time=? where ip=?";
        Timestamp time = new Timestamp(System.currentTimeMillis());//获取当前系统时间
        jdbcTemplate.update(sql, userId, time, ip);
    }

    /**
     * 更新节点系统时间
     */
    public void updateNodeTime(String ip) {

        String sql = "update ExperimentalNode set time=? where ip=?";
        Timestamp time = new Timestamp(System.currentTimeMillis());//获取当前系统时间
        jdbcTemplate.update(sql, time, ip);
    }

    /**
     * 根据userId更新时间
     * @param userId
     */
    public void updateNodeTimeByUserId(String userId) {
        String sql = "update ExperimentalNode set time=? where userId=?";
        Timestamp time = new Timestamp(System.currentTimeMillis());//获取当前系统时间
        jdbcTemplate.update(sql, time, userId);
    }

    /**
     * 通过UserId得到节点数量
     * @param userId
     * @return
     */
    public int getNodeCountByUserId(String userId) {

        String sql = "select count(*) from ExperimentalNode where userId=? and status='正常'";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return rowCount;
    }

    /**
     * 通过userId得到节点
     * @param userId
     * @return
     */
    public List<ExperimentalNode> getNodeByUserId(String userId) {

        if(this.getNodeCountByUserId(userId) == 0) {
            return null;
        } else {
            String sql = "select * from ExperimentalNode where userId=? and status='正常'";
            List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
                @Override
                public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                    ExperimentalNode experimentalNode = new ExperimentalNode();
                    experimentalNode.setIp(resultSet.getString("ip"));
                    experimentalNode.setUserId(resultSet.getString("userId"));
                    experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                    experimentalNode.setStatus(resultSet.getString("status"));
                    experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                    return experimentalNode;
                }
            }, userId);

            return experimentalNodeList;
        }
    }

    /**
     * 通过ip将UserId和Time设置为空
     * @param ip
     */
    public void setUserIdAndTimeNullByIp(String ip) {
        String sql = "update ExperimentalNode set userId=null, time=null, status='正常' where ip=?";
        jdbcTemplate.update(sql, ip);
    }

    /**
     * 获得正在使用的节点的数量
     * @return
     */
    public int getNodeCountByUserIdAndTimeNotNull() {

        String sql = "select count(*) from ExperimentalNode where userId is not null and time is not null and status='正常'";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    /**
     * 获得正在使用的节点
     * @return
     */
    public List<ExperimentalNode> getNodeByUserIdAndTimeNotNull() {
        if(getNodeCountByUserIdAndTimeNotNull() == 0) {
            return null;
        } else {
            String sql = "select * from ExperimentalNode where userId is not null and time is not null and status='正常'";
            List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
                @Override
                public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {

                    ExperimentalNode experimentalNode = new ExperimentalNode();
                    experimentalNode.setIp(resultSet.getString("ip"));
                    experimentalNode.setUserId(resultSet.getString("userId"));
                    experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                    experimentalNode.setStatus(resultSet.getString("status"));
                    experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                    return experimentalNode;
                }
            });
            return experimentalNodeList;
        }
    }

    /**
     * 获得指定ip，且用户为空的节点个数
     * @param ip
     * @return
     */
    public int getNodeCountUserIdNullByIp(String ip) {
        String sql = "select count(*) from ExperimentalNode where ip=? and userId is null and status='正常'";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, ip);
        return rowCount;
    }


    public int getNodeCountByIp(String ip) {
        String sql = "select count(*) from ExperimentalNode where ip=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, ip);
        return rowCount;
    }

    /**
     * 获得指定ip的节点
     * @param ip
     * @return
     */
    public ExperimentalNode getNodeByIp(String ip) {
        String sql = "select * from ExperimentalNode where ip=?";
        ExperimentalNode experimentalNode = jdbcTemplate.queryForObject(sql, new RowMapper<ExperimentalNode>() {
            @Override
            public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalNode experimentalNode = new ExperimentalNode();
                experimentalNode.setIp(resultSet.getString("ip"));
                experimentalNode.setUserId(resultSet.getString("userId"));
                experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                experimentalNode.setStatus(resultSet.getString("status"));
                experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                return experimentalNode;
            }
        }, ip);
        return experimentalNode;
    }


    public void setUserIdAndTimeNull() {
        String sql = "update ExperimentalNode set userId=null, time=null, status='正常'";
        jdbcTemplate.update(sql);
    }

    public int getNodeCount() {
        String sql = "select count(*) from ExperimentalNode";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    public List<ExperimentalNode> getAllNodeOrderByIp() {
        if(this.getNodeCount() == 0) {
            return null;
        } else {
            String sql = "select * from ExperimentalNode order by ip";
            List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
                @Override
                public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                    ExperimentalNode experimentalNode = new ExperimentalNode();
                    experimentalNode.setIp(resultSet.getString("ip"));
                    experimentalNode.setUserId(resultSet.getString("userId"));
                    experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                    experimentalNode.setStatus(resultSet.getString("status"));
                    experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                    return experimentalNode;
                }
            });
            return experimentalNodeList;
        }
    }

    public void updateStatusByIp(String ip, String status) {
        String sql = "update ExperimentalNode set status=? where ip=?";
        jdbcTemplate.update(sql, status, ip);
    }

    public int getAvailableNodeCountByUserId(String userId) {
        String sql = "select count(*) from ExperimentalNode where (userId=? and status='正常') or (userId is null and time is null and status='正常')";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return rowCount;
    }

    public List<ExperimentalNode> getAvailableNodeByUserIdOrderByIp(String userId) {
        if(this.getAvailableNodeCountByUserId(userId) == 0) {
            return null;
        } else {
            String sql = "select * from ExperimentalNode where (userId=? and status='正常') or (userId is null and time is null and status='正常') order by ip";
            List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
                @Override
                public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                    ExperimentalNode experimentalNode = new ExperimentalNode();
                    experimentalNode.setIp(resultSet.getString("ip"));
                    experimentalNode.setUserId(resultSet.getString("userId"));
                    experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                    experimentalNode.setStatus(resultSet.getString("status"));
                    experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                    return experimentalNode;
                }
            }, userId);
            return experimentalNodeList;
        }
    }

    public void insertByIp(String ip) {
        String sql = "insert into ExperimentalNode values(?, null, null, '正常')";
        jdbcTemplate.update(sql, ip);
    }

    public void deleteAll() {
        String sql = "delete from ExperimentalNode";
        jdbcTemplate.update(sql);
    }

    public int getNodeCountAndStatusIsSuccess() {
        String sql = "select count(*) from ExperimentalNode where status='正常'";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    public List<ExperimentalNode> getAllStatusSuccessNode() {
        String sql = "select * from ExperimentalNode where status='正常'";
        List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
            @Override
            public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalNode experimentalNode = new ExperimentalNode();
                experimentalNode.setIp(resultSet.getString("ip"));
                experimentalNode.setUserId(resultSet.getString("userId"));
                experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                experimentalNode.setStatus(resultSet.getString("status"));
                experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                return experimentalNode;
            }
        });
        return experimentalNodeList;
    }


    public int getCountByGroupNumber(int groupNumber) {
        String sql = "select count(*) from ExperimentalNode where groupNumber=?";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class, groupNumber);
        return rowCount;
    }

    public void insertByIpAndGroupNumber(String ip, int groupNumber) {
        String sql = "insert into ExperimentalNode values(?, null, null, '正常', ?)";
        jdbcTemplate.update(sql, ip, groupNumber);
    }
    public List<ExperimentalNode> getExperimentalNodeByGroupNumberAndStatusOrderByIp(int groupNumber, String status) {
        String sql = "select * from ExperimentalNode where groupNumber=? and status=?";
        List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
            @Override
            public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalNode experimentalNode = new ExperimentalNode();
                experimentalNode.setIp(resultSet.getString("ip"));
                experimentalNode.setUserId(resultSet.getString("userId"));
                experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                experimentalNode.setStatus(resultSet.getString("status"));
                experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                return experimentalNode;
            }
        }, groupNumber, status);
        return experimentalNodeList;
    }

    public int getCountByGroupNumberAndStatus(int groupNumber, String status) {
        String sql = "select count(*) from ExperimentalNode where groupNumber=? and status=?";
        int rowCount = jdbcTemplate.queryForObject(sql, Integer.class, groupNumber, status);
        return rowCount;
    }

    public List<ExperimentalNode> getExperimentalNodeByGroupNumber(int groupNumber) {
        String sql = "select * from ExperimentalNode where groupNumber=?";
        List<ExperimentalNode> experimentalNodeList = jdbcTemplate.query(sql, new RowMapper<ExperimentalNode>() {
            @Override
            public ExperimentalNode mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalNode experimentalNode = new ExperimentalNode();
                experimentalNode.setIp(resultSet.getString("ip"));
                experimentalNode.setUserId(resultSet.getString("userId"));
                experimentalNode.setDatetime(resultSet.getTimestamp("time"));
                experimentalNode.setStatus(resultSet.getString("status"));
                experimentalNode.setGroupNumber(resultSet.getInt("groupNumber"));
                return experimentalNode;
            }
        }, groupNumber);
        return experimentalNodeList;
    }

    public void setAllGroupNumberNull() {
        String sql = "update ExperimentalNode set groupNumber=null";
        jdbcTemplate.update(sql);
    }

    public void setGroupNumberByIp(int groupNumber, String ip) {
        String sql = "update ExperimentalNode set groupNumber=? where ip=?";
        jdbcTemplate.update(sql, groupNumber, ip);
    }
}