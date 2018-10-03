package com.webapps.creghip.repository;

import com.webapps.creghip.domain.ExchangeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEntryRepository extends JpaRepository<ExchangeEntry, Long> {
}
