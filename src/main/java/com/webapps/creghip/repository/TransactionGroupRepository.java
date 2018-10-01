package com.webapps.creghip.repository;

import com.webapps.creghip.domain.TransactionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TransactionGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransactionGroupRepository extends JpaRepository<TransactionGroup, Long> {

}
