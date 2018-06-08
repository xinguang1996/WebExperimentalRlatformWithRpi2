package com.gxg.dao;

import com.gxg.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by 郭欣光 on 2017/12/27.
 */

@Repository
public class UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 判断用户是否存在
     */
    public Boolean isUser(String id) {

        int rowCount = this.jdbcTemplate.queryForObject("select count(*) from User where id=?", Integer.class, id);
        if(rowCount == 0) {
            return false;
        } else {
            return true;
        }
    }

    public User getUser(String id) {

        if(isUser(id)) {
            String sql = "select * from User where id=?";
            User user = jdbcTemplate.queryForObject(sql, new RowMapper<User>() {
                @Override
                public User mapRow(ResultSet resultSet, int i) throws SQLException {
                    User user = new User();
                    user.setId(resultSet.getString("id"));
                    user.setPassword(resultSet.getString("password"));
                    user.setEmail(resultSet.getString("email"));
                    user.setName(resultSet.getString("name"));
                    user.setRole(resultSet.getString("role"));
                    user.setSex(resultSet.getString("sex"));
                    user.setTel(resultSet.getString("tel"));
                    return user;
                }
            }, id);

            return user;
        } else {
            return null;
        }
    }

    public void updatePasswordById(String password, String id) {
        String sql = "update User set password=? where id=?";
        jdbcTemplate.update(sql, password, id);
    }

    public void insertUser(User user) {
        String sql = "insert into User values(?,?,?,?,?,?,?)";
        jdbcTemplate.update(sql, user.getId(), user.getPassword(), user.getName(), user.getSex(), user.getEmail(), user.getTel(), user.getRole());
    }

    public void updateUserById(User user) {
        String sql = "update User set name=?, sex=?, tel=?, email=? where id=?";
        jdbcTemplate.update(sql, user.getName(), user.getSex(), user.getTel(), user.getEmail(), user.getId());
    }

}
