package com.gxg.dao;

import com.gxg.entities.ExperimentalReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by 郭欣光 on 2018/3/27.
 */

@Repository
public class ExperimentalReportDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insertExperimentalReport(ExperimentalReport experimentalReport) {
        String sql = "insert into ExperimentalReport values(?,?,?,?,?)";
        jdbcTemplate.update(sql, experimentalReport.getId(), experimentalReport.getTitle(), experimentalReport.getName(), experimentalReport.getCreateTime(), experimentalReport.getExperimentalId());
    }

    public int getExperimentalReportCountByExperimentalId(String experimentalId) {
        String sql = "select count(*) from ExperimentalReport where experimentalId=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, experimentalId);
        return rowCount;
    }

    public List<ExperimentalReport> getExperimentalReportByExperimentalIdAndStartLimitAndEndLimit(String experimentalId, int limitStart, int limitEnd) {
        String sql = "select * from ExperimentalReport where experimentalId=? order by createTime desc limit ?, ?";
        List<ExperimentalReport> experimentalReportList = jdbcTemplate.query(sql, new RowMapper<ExperimentalReport>() {
            @Override
            public ExperimentalReport mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalReport experimentalReport = new ExperimentalReport();
                experimentalReport.setId(resultSet.getString("id"));
                experimentalReport.setExperimentalId(resultSet.getString("experimentalId"));
                experimentalReport.setCreateTime(resultSet.getTimestamp("createTime"));
                experimentalReport.setName(resultSet.getString("name"));
                experimentalReport.setTitle(resultSet.getString("title"));
                return experimentalReport;
            }
        }, experimentalId, limitStart, limitEnd);
        return experimentalReportList;
    }

    public int getExperimentalReportCountById(String id) {
        String sql = "select count(*) from ExperimentalReport where id=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, id);
        return rowCount;
    }

    public ExperimentalReport getExperimentalReportById(String id) {
        String sql = "select * from ExperimentalReport where id=?";
        ExperimentalReport experimentalReport = jdbcTemplate.queryForObject(sql, new RowMapper<ExperimentalReport>() {
            @Override
            public ExperimentalReport mapRow(ResultSet resultSet, int i) throws SQLException {
                ExperimentalReport experimentalReport = new ExperimentalReport();
                experimentalReport.setId(resultSet.getString("id"));
                experimentalReport.setExperimentalId(resultSet.getString("experimentalId"));
                experimentalReport.setCreateTime(resultSet.getTimestamp("createTime"));
                experimentalReport.setName(resultSet.getString("name"));
                experimentalReport.setTitle(resultSet.getString("title"));
                return experimentalReport;
            }
        }, id);
        return experimentalReport;
    }

    public void deleteExperimentalReportById(String id) {
        String sql = "delete from ExperimentalReport where id=?";
        jdbcTemplate.update(sql, id);
    }
}
