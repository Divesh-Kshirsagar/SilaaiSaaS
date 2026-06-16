package com.silaaisaas.customer;

import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ShopService shopService;

    public record CustomerRequest(@NotBlank String name, @NotBlank String phone) {}

    public Page<Customer> list(String search, Pageable pageable) {
        Shop shop = shopService.getShop();
        return customerRepository.searchByShop(shop.getId(), search == null ? "" : search, pageable);
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }

    @Transactional
    public Customer create(CustomerRequest req) {
        Shop shop = shopService.getShop();
        Customer customer = Customer.builder()
                .shop(shop)
                .name(req.name())
                .phone(req.phone())
                .build();
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(Long id, CustomerRequest req) {
        Customer customer = getById(id);
        customer.setName(req.name());
        customer.setPhone(req.phone());
        return customerRepository.save(customer);
    }
}
