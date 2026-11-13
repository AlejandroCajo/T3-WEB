package com.upn.service.implementation;

import com.upn.model.Customer;
import com.upn.repository.ICustomerRepository;
import com.upn.repository.IGenericRepository;
import com.upn.service.ICustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService extends GenericService<Customer, Integer> implements ICustomerService {
    private final ICustomerRepository repo;

    @Override
    protected IGenericRepository<Customer, Integer> getRepo() {
        return repo;
    }
}
