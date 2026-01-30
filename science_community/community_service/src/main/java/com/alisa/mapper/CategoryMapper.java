package com.alisa.mapper;

import com.alisa.dto.CategoryFilter;
import com.alisa.model.Category;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CategoryMapper {
    long countByExample(CategoryFilter example);

    int deleteByExample(CategoryFilter example);

    int deleteByPrimaryKey(String categoryId);

    int insert(Category row);

    int insertSelective(Category row);

    List<Category> selectByExample(CategoryFilter example);

    Category selectByPrimaryKey(String categoryId);

    int updateByExampleSelective(@Param("row") Category row, @Param("example") CategoryFilter example);

    int updateByExample(@Param("row") Category row, @Param("example") CategoryFilter example);

    int updateByPrimaryKeySelective(Category row);

    int updateByPrimaryKey(Category row);

    int upsert(Category record);

    int batchUpsert(@Param("list") List<Category> list);

    int batchDelete(@Param("list") List<String> list);
}