package com.jhipster.demo.store.repository;

import com.jhipster.demo.store.domain.Customer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends ReactiveCrudRepository<Customer, Long>, CustomerRepositoryInternal {
    Flux<Customer> findAllBy(Pageable pageable);

    @Query("SELECT * FROM customer entity WHERE entity.user_id = :id")
    Flux<Customer> findByUser(Long id);

    @Query("SELECT * FROM customer entity WHERE entity.user_id IS NULL")
    Flux<Customer> findAllWhereUserIsNull();

    @Override
    <S extends Customer> Mono<S> save(S entity);

    @Override
    Flux<Customer> findAll();

    @Override
    Mono<Customer> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface CustomerRepositoryInternal {
    <S extends Customer> Mono<S> save(S entity);

    Flux<Customer> findAllBy(Pageable pageable);

    Flux<Customer> findAll();

    Mono<Customer> findById(Long id);

    Flux<Customer> findAllBy(Pageable pageable, Criteria criteria);
}
