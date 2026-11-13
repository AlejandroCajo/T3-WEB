package com.upn.repository;

import com.upn.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICategoryRepository extends IGenericRepository<Category, Integer> {
    /*Category save(Category category);
    Category update(Category category, Integer id);
    List<Category> findAll();
    Category findById(Integer id);
    void delete(Integer id);*/
}
