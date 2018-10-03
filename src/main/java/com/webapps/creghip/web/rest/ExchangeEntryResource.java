package com.webapps.creghip.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.webapps.creghip.domain.ExchangeEntry;
import com.webapps.creghip.repository.ExchangeEntryRepository;
import com.webapps.creghip.web.rest.errors.BadRequestAlertException;
import com.webapps.creghip.web.rest.util.HeaderUtil;
import com.webapps.creghip.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ExchangeEntryResource {

    private final Logger log = LoggerFactory.getLogger(ExchangeEntryResource.class);

    private static final String ENTITY_NAME = "exchangeEntry";

    private ExchangeEntryRepository exchangeEntryRepository;

    public ExchangeEntryResource(ExchangeEntryRepository exchangeEntryRepository) {
        this.exchangeEntryRepository = exchangeEntryRepository;
    }

    @PostMapping("/exchange-entries")
    @Timed
    public ResponseEntity<ExchangeEntry> createExchangeEntry(@Valid @RequestBody ExchangeEntry exchangeEntry) throws URISyntaxException {
        log.debug("REST request to create ExchangeEntry : {}", exchangeEntry);
        if (exchangeEntry.getId() != null) {
            throw new BadRequestAlertException("A new ExchangeEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExchangeEntry result = exchangeEntryRepository.save(exchangeEntry);
        return ResponseEntity.created(new URI("/api/exchange-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/exchange-entries")
    @Timed
    public ResponseEntity<ExchangeEntry> updateExchangeEntry(@Valid @RequestBody ExchangeEntry exchangeEntry) throws URISyntaxException {
        log.debug("REST request to update ExchangeEntry : {}", exchangeEntry);
        if (exchangeEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ExchangeEntry result = exchangeEntryRepository.save(exchangeEntry);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, exchangeEntry.getId().toString()))
            .body(result);
    }

    @GetMapping("/exchange-entries")
    @Timed
    public ResponseEntity<List<ExchangeEntry>> getExchangeEntries(Pageable pageable) {
        log.debug("REST request to get a page of Exchange Entries");
        Page<ExchangeEntry> page = exchangeEntryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/exchange-entries");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/exchange-entries/{id}")
    @Timed
    public ResponseEntity<ExchangeEntry> getExchangeEntry(@PathVariable Long id) {
        log.debug("REST request to get an ExchangeEntry : {}", id);
        Optional<ExchangeEntry> exchangeEntry = exchangeEntryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(exchangeEntry);
    }

    @DeleteMapping("/exchange-entries/{id}")
    @Timed
    public ResponseEntity<Void> deleteCurrency(@PathVariable Long id) {
        log.debug("REST request to delete ExchangeEntry : {}", id);
        exchangeEntryRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/exchange-entries/batched/{ids}")
    @Timed
    public ResponseEntity<Void> deleteCurrencies(@PathVariable String ids) {
        log.debug("REST request the following ExchangeEntry ids are marked for deletion: {}", ids);
        List<ExchangeEntry> exchangeEntries = exchangeEntryRepository.findAllById(
            Arrays.stream(ids.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList()));
        exchangeEntryRepository.deleteAll(exchangeEntries);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, ids)).build();
    }
}
