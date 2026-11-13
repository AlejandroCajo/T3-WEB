package com.upn.service;

import com.upn.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICategoryService extends IGenericService<Category, Integer> {
    /*Category save(Category category) throws Exception;
    Category update(Integer id, Category category) throws Exception;
    List<Category> findAll() throws Exception;
    Category findById(Integer id) throws Exception;
    void delete(Integer id) throws Exception;*/
    Page<Category> listPaginable(Pageable pageable);
}
