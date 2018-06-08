package com.gxg.dao;

import com.gxg.entities.ExperimentalDocument;
import com.gxg.entities.ExperimentalEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by 郭欣光 on 2018/3/14.
 */

@Repository
public class ExperimentalEnvironmentDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void createExperimetalEnvironment(ExperimentalEnvironment experimentalEnvironment) {
        String sql = "insert into ExperimentalEnvironment values(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, experimentalEnvironment.getId(), experimentalEnvironment.getName(), experimentalEnvironment.getStatus(), experimentalEnvironment.getCourse(), experimentalEnvironment.getSize(), experimentalEnvironment.getCreateTime());
    }

    public int getExperimentalEnvironmentCountByCourse(String courseId) {
        String sql = "select count(*) from ExperimentalEnvironment where course=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, courseId);
        return rowCount;
    }

    public List<ExperimentalEnvironment> getExperimentalEnviromentByCourse(String courseId) {
        if(this.getExperimentalEnvironmentCountByCourse(courseId) == 0) {
            return null;
        }
        String sql = "select * from ExperimentalEnvironment where course=?";
        List<ExperimentalEnvironment> experimentalEnvironmentList = jdbcTemplate.query(sql, new RowMapper<ExperimentalEnvironment>() {
            @Override
            public ExperimentalEnvironment mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalEnvironment experimentalEnvironment = new ExperimentalEnvironment();
                experimentalEnvironment.setId(resultSet.getString("id"));
                experimentalEnvironment.setName(resultSet.getString("name"));
                experimentalEnvironment.setStatus(resultSet.getString("status"));
                experimentalEnvironment.setCourse(resultSet.getString("Course"));
                experimentalEnvironment.setSize(resultSet.getDouble("size"));
                experimentalEnvironment.setCreateTime(resultSet.getTimestamp("createTime"));
                return experimentalEnvironment;
            }
        }, courseId);
        return experimentalEnvironmentList;
    }

    public int getExperimentalEnvironmentCountById(String id) {
        String sql = "select count(*) from ExperimentalEnvironment where id=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, id);
        return rowCount;
    }

    public ExperimentalEnvironment getExperimentalEnvironmentById(String id) {
        if(this.getExperimentalEnvironmentCountById(id) == 0) {
            return null;
        } else {
            String sql = "select * from ExperimentalEnvironment where id=?";
            ExperimentalEnvironment experimentalEnvironment = jdbcTemplate.queryForObject(sql, new RowMapper<ExperimentalEnvironment>() {
                @Override
                public ExperimentalEnvironment mapRow(ResultSet resultSet, int i) throws SQLException {
                    ExperimentalEnvironment experimentalEnvironment = new ExperimentalEnvironment();
                    experimentalEnvironment.setId(resultSet.getString("id"));
                    experimentalEnvironment.setName(resultSet.getString("name"));
                    experimentalEnvironment.setStatus(resultSet.getString("status"));
                    experimentalEnvironment.setCourse(resultSet.getString("Course"));
                    experimentalEnvironment.setSize(resultSet.getDouble("size"));
                    experimentalEnvironment.setCreateTime(resultSet.getTimestamp("createTime"));
                    return experimentalEnvironment;
                }
            }, id);
            return experimentalEnvironment;
        }
    }

    public void updateStatusById(String status, String id) {
        String sql = "update ExperimentalEnvironment set status=? where id=?";
        jdbcTemplate.update(sql, status, id);
    }

    public void deleteExperimentalEnvironmentById(String id) {
        String sql = "delete from ExperimentalEnvironment where id=?";
        jdbcTemplate.update(sql, id);
    }
}
