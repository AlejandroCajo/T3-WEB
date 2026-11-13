package com.upn.service.implementation;

import com.upn.model.Category;
import com.upn.repository.ICategoryRepository;
import com.upn.repository.IGenericRepository;
import com.upn.service.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService extends GenericService<Category, Integer> implements ICategoryService {
    private final ICategoryRepository repo;

    @Override
    protected IGenericRepository<Category, Integer> getRepo() {
        return repo;
    }

    @Override
    public Page<Category> listPaginable(Pageable pageable) {
        return repo.findAll(pageable);
    }
    /*@Override
    public Category save(Category category) throws Exception {
        return repo.save(category);
    }

    @Override
    public Category update(Integer id, Category category) throws Exception {
        // validar id
        return repo.save(category);
    }

    @Override
    public List<Category> findAll() throws Exception {
        return repo.findAll();
    }

    @Override
    public Category findById(Integer id) throws Exception {
        return repo.findById(id).orElse(new Category());
    }

    @Override
    public void delete(Integer id) throws Exception {
        repo.deleteById(id);
    }*/
}
