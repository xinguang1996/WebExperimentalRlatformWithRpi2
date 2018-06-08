package com.gxg.dao;

import com.gxg.entities.ExperimentalDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by 郭欣光 on 2018/1/11.
 */

@Repository
public class ExperimentalDocumentDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void createExperimentalDocumental(String id, String title, String name, String courseId, Timestamp createTime, Timestamp modificationTime) {

        String sql = "insert into ExperimentalDocument values(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, id, title, name, courseId, createTime, modificationTime);

    }

    public List<ExperimentalDocument> getExperimentalDocumentByCourseId(String courseId) {
        if(this.getExperimentalDocumentCountByCourseId(courseId) == 0) {
            return null;
        }
        String sql = "select * from ExperimentalDocument where courseId=? order by id";
        List<ExperimentalDocument> experimentalDocumentList = jdbcTemplate.query(sql, new RowMapper<ExperimentalDocument>() {
            @Override
            public ExperimentalDocument mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalDocument experimentalDocument = new ExperimentalDocument();
                experimentalDocument.setId(resultSet.getString("id"));
                experimentalDocument.setTitle(resultSet.getString("title"));
                experimentalDocument.setName(resultSet.getString("name"));
                experimentalDocument.setCourseId(resultSet.getString("courseId"));
                experimentalDocument.setCreateTime(resultSet.getTimestamp("createTime"));
                experimentalDocument.setModificationTime(resultSet.getTimestamp("modificationTime"));
                return experimentalDocument;
            }
        }, courseId);
        return experimentalDocumentList;
    }

    public int getExperimentalDocumentCountByCourseId(String courseId) {
        String sql = "select count(*) from ExperimentalDocument where courseId=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, courseId);
        return rowCount;
    }

    public List<ExperimentalDocument> getExperimentalDocumentTop5ByCourseId(String courseId) {
        if(this.getExperimentalDocumentCountByCourseId(courseId) == 0) {
            return null;
        }
        String sql = "select * from ExperimentalDocument where courseId=? order by id limit 0, 5";
        List<ExperimentalDocument> experimentalDocumentList = jdbcTemplate.query(sql, new RowMapper<ExperimentalDocument>() {
            @Override
            public ExperimentalDocument mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalDocument experimentalDocument = new ExperimentalDocument();
                experimentalDocument.setId(resultSet.getString("id"));
                experimentalDocument.setTitle(resultSet.getString("title"));
                experimentalDocument.setName(resultSet.getString("name"));
                experimentalDocument.setCourseId(resultSet.getString("courseId"));
                experimentalDocument.setCreateTime(resultSet.getTimestamp("createTime"));
                experimentalDocument.setModificationTime(resultSet.getTimestamp("modificationTime"));
                return experimentalDocument;
            }
        }, courseId);
        return experimentalDocumentList;
    }

    public int getExperimentalDocumentCountById(String id) {
        String sql = "select count(*) from ExperimentalDocument where id=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, id);
        return rowCount;
    }

    public ExperimentalDocument getExperimentalDocumentById(String id) {
        if(this.getExperimentalDocumentCountById(id) == 0) {
            return null;
        }
        String sql = "select * from ExperimentalDocument where id=?";
        ExperimentalDocument experimentalDocument = jdbcTemplate.queryForObject(sql, new RowMapper<ExperimentalDocument>() {
            @Override
            public ExperimentalDocument mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalDocument experimentalDocument = new ExperimentalDocument();
                experimentalDocument.setId(resultSet.getString("id"));
                experimentalDocument.setTitle(resultSet.getString("title"));
                experimentalDocument.setName(resultSet.getString("name"));
                experimentalDocument.setCourseId(resultSet.getString("courseId"));
                experimentalDocument.setCreateTime(resultSet.getTimestamp("createTime"));
                experimentalDocument.setModificationTime(resultSet.getTimestamp("modificationTime"));
                return experimentalDocument;
            }
        }, id);
        return experimentalDocument;
    }

    public void deleteExperimentalDocumentById(String id) {
        String sql = "delete from ExperimentalDocument where id=?";
        jdbcTemplate.update(sql, id);
    }

    public void updateTitleAndModificationTimeById(String id, String title, Timestamp time) {
        String sql = "update ExperimentalDocument set title=?, modificationTime=? where id=?";
        jdbcTemplate.update(sql, title, time, id);
    }

    public void updateModificationTimeById(String id, Timestamp time) {
        String sql = "update ExperimentalDocument set modificationTime=? where id=?";
        jdbcTemplate.update(sql, time, id);
    }
}
