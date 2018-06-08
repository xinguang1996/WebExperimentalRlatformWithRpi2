package com.gxg.dao;

import com.gxg.entities.Course;
import com.gxg.entities.ExperimentalNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by 郭欣光 on 2018/1/5.
 */

@Repository
public class CourseDao {

    @Value("${teacher.course.page.amount}")
    int teacherCoursesPageAmount;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void createCourse(String id, String name, String tab, String decription, String img, String teacher, Timestamp createTime, Timestamp modificationTime) {

        String sql = "insert into Course values(?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, id, name, tab, decription, img, teacher, createTime, modificationTime);

    }

    public int getCoursesCountByTeacherAndPage(String teacher, int page) {
        String sql = "select count(*) from Course where teacher=? order by modificationTime limit ?, ?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, teacher, (page-1)*teacherCoursesPageAmount, teacherCoursesPageAmount);
        return rowCount;
    }

    public List<Course> getCoursesByTeacherAndPage(String teacher, int page) {
        if(this.getCoursesCountByTeacherAndPage(teacher, page) == 0) {
            return null;
        }

        String sql = "select * from Course where teacher=? order by modificationTime desc limit ?, ?";

        List<Course> courseList = jdbcTemplate.query(sql, new RowMapper<Course>() {
            @Override
            public Course mapRow(ResultSet resultSet, int i) throws SQLException {
                Course course = new Course();
                course.setId(resultSet.getString("id"));
                course.setName(resultSet.getString("name"));
                course.setTab(resultSet.getString("tab"));
                course.setDescription(resultSet.getString("description"));
                course.setImg(resultSet.getString("img"));
                course.setTeacher(resultSet.getString("teacher"));
                course.setCreateTime(resultSet.getTimestamp("createTime"));
                course.setModificationTime(resultSet.getTimestamp("modificationTime"));
                return course;
            }
        }, teacher, (page-1)*teacherCoursesPageAmount, teacherCoursesPageAmount);
        return courseList;
    }

    public int getCourseCountById(String id) {
        String sql = "select count(*) from Course where id=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, id);
        return rowCount;
    }

    public Course getCourseById(String id) {
        if(this.getCourseCountById(id) == 0) {
            return null;
        }
        String sql = "select * from Course where id=?";
        Course course = jdbcTemplate.queryForObject(sql, new RowMapper<Course>() {
            @Override
            public Course mapRow(ResultSet resultSet, int i) throws SQLException {
                Course course = new Course();
                course.setId(resultSet.getString("id"));
                course.setName(resultSet.getString("name"));
                course.setTab(resultSet.getString("tab"));
                course.setDescription(resultSet.getString("description"));
                course.setImg(resultSet.getString("img"));
                course.setTeacher(resultSet.getString("teacher"));
                course.setCreateTime(resultSet.getTimestamp("createTime"));
                course.setModificationTime(resultSet.getTimestamp("modificationTime"));
                return course;
            }
        }, id);
        return course;
    }

    public int getCoursesCountByTeacher(String teacher) {
        String sql = "select count(*) from Course where teacher=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, teacher);
        return rowCount;
    }

    public List<Course> getCoursesTop5ByTeacher(String teacher) {
        if(this.getCoursesCountByTeacher(teacher) == 0) {
            return null;
        }
        String sql = "select * from Course where teacher=? order by modificationTime desc limit 0, 5";
        List<Course> courseList = jdbcTemplate.query(sql, new RowMapper<Course>() {
            @Override
            public Course mapRow(ResultSet resultSet, int i) throws SQLException {
                Course course = new Course();
                course.setId(resultSet.getString("id"));
                course.setName(resultSet.getString("name"));
                course.setTab(resultSet.getString("tab"));
                course.setDescription(resultSet.getString("description"));
                course.setImg(resultSet.getString("img"));
                course.setTeacher(resultSet.getString("teacher"));
                course.setCreateTime(resultSet.getTimestamp("createTime"));
                course.setModificationTime(resultSet.getTimestamp("modificationTime"));
                return course;
            }
        }, teacher);
        return courseList;
    }

    public void updateModificationTimeById(Timestamp time, String id) {
        String sql = "update Course set modificationTime=? where id=?";
        jdbcTemplate.update(sql, time, id);
    }

    public void updateNameAndDescriptionAndModificationTimeById(String id, String name, String description, Timestamp time) {
        String sql = "update Course set name=?, description=?, modificationTime=? where id=?";
        jdbcTemplate.update(sql, name, description, time, id);
    }

    public void deleteCourseById(String id) {
        String sql = "delete from Course where id=?";
        jdbcTemplate.update(sql, id);
    }

    public int getCoursesCount() {
        String sql = "select count(*) from Course";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class);
        return rowCount;
    }

    public List<Course> getCoursesTopNumber(int number) {
        if(this.getCoursesCount() == 0) {
            return null;
        } else {
            String sql = "select * from Course order by modificationTime desc limit 0, ?";
            List<Course> courseList = jdbcTemplate.query(sql, new RowMapper<Course>() {
                @Override
                public Course mapRow(ResultSet resultSet, int i) throws SQLException {
                    Course course = new Course();
                    course.setId(resultSet.getString("id"));
                    course.setName(resultSet.getString("name"));
                    course.setTab(resultSet.getString("tab"));
                    course.setDescription(resultSet.getString("description"));
                    course.setImg(resultSet.getString("img"));
                    course.setTeacher(resultSet.getString("teacher"));
                    course.setCreateTime(resultSet.getTimestamp("createTime"));
                    course.setModificationTime(resultSet.getTimestamp("modificationTime"));
                    return course;
                }
            }, number);
            return courseList;
        }
    }

    public int getCoursesCountByTab(String tab) {
        String sql = "select count(*) from Course where tab=?";
        int rowCount = this.jdbcTemplate.queryForObject(sql, Integer.class, tab);
        return rowCount;
    }

    public List<Course> getCoursesByLimit(int limitStart, int limitStop) {
        if(this.getCoursesCount() == 0) {
            return null;
        } else {
            String sql = "select * from Course order by modificationTime desc limit ?, ?";
            List<Course> courseList = jdbcTemplate.query(sql, new RowMapper<Course>() {
                @Override
                public Course mapRow(ResultSet resultSet, int i) throws SQLException {
                    Course course = new Course();
                    course.setId(resultSet.getString("id"));
                    course.setName(resultSet.getString("name"));
                    course.setTab(resultSet.getString("tab"));
                    course.setDescription(resultSet.getString("description"));
                    course.setImg(resultSet.getString("img"));
                    course.setTeacher(resultSet.getString("teacher"));
                    course.setCreateTime(resultSet.getTimestamp("createTime"));
                    course.setModificationTime(resultSet.getTimestamp("modificationTime"));
                    return course;
                }
            }, limitStart, limitStop);
            return courseList;
        }
    }

    public List<Course> getCoursesByTabAndLimit(String tab, int limitStart, int limitStop) {
        if(this.getCoursesCount() == 0) {
            return null;
        } else {
            String sql = "select * from Course where tab=? order by modificationTime desc limit ?, ?";
            List<Course> courseList = jdbcTemplate.query(sql, new RowMapper<Course>() {
                @Override
                public Course mapRow(ResultSet resultSet, int i) throws SQLException {
                    Course course = new Course();
                    course.setId(resultSet.getString("id"));
                    course.setName(resultSet.getString("name"));
                    course.setTab(resultSet.getString("tab"));
                    course.setDescription(resultSet.getString("description"));
                    course.setImg(resultSet.getString("img"));
                    course.setTeacher(resultSet.getString("teacher"));
                    course.setCreateTime(resultSet.getTimestamp("createTime"));
                    course.setModificationTime(resultSet.getTimestamp("modificationTime"));
                    return course;
                }
            }, tab, limitStart, limitStop);
            return courseList;
        }
    }
}
