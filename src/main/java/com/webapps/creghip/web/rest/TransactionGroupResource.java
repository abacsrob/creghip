package com.webapps.creghip.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.webapps.creghip.domain.TransactionGroup;
import com.webapps.creghip.repository.TransactionGroupRepository;
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

/**
 * REST controller for managing TransactionGroup.
 */
@RestController
@RequestMapping("/api")
public class TransactionGroupResource {

    private final Logger log = LoggerFactory.getLogger(TransactionGroupResource.class);

    private static final String ENTITY_NAME = "transactionGroup";

    private final TransactionGroupRepository transactionGroupRepository;

    public TransactionGroupResource(TransactionGroupRepository transactionGroupRepository) {
        this.transactionGroupRepository = transactionGroupRepository;
    }

    /**
     * POST  /transaction-groups : Create a new transactionGroup.
     *
     * @param transactionGroup the transactionGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new transactionGroup, or with status 400 (Bad Request) if the transactionGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/transaction-groups")
    @Timed
    public ResponseEntity<TransactionGroup> createTransactionGroup(@Valid @RequestBody TransactionGroup transactionGroup) throws URISyntaxException {
        log.debug("REST request to save TransactionGroup : {}", transactionGroup);
        if (transactionGroup.getId() != null) {
            throw new BadRequestAlertException("A new transactionGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TransactionGroup result = transactionGroupRepository.save(transactionGroup);
        return ResponseEntity.created(new URI("/api/transaction-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /transaction-groups : Updates an existing transactionGroup.
     *
     * @param transactionGroup the transactionGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated transactionGroup,
     * or with status 400 (Bad Request) if the transactionGroup is not valid,
     * or with status 500 (Internal Server Error) if the transactionGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/transaction-groups")
    @Timed
    public ResponseEntity<TransactionGroup> updateTransactionGroup(@Valid @RequestBody TransactionGroup transactionGroup) throws URISyntaxException {
        log.debug("REST request to update TransactionGroup : {}", transactionGroup);
        if (transactionGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TransactionGroup result = transactionGroupRepository.save(transactionGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, transactionGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /transaction-groups : get all the transactionGroups.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of transactionGroups in body
     */
    @GetMapping("/transaction-groups")
    @Timed
    public ResponseEntity<List<TransactionGroup>> getAllTransactionGroups(Pageable pageable) {
        log.debug("REST request to get a page of TransactionGroups");
        Page<TransactionGroup> page = transactionGroupRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/transaction-groups");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /transaction-groups/:id : get the "id" transactionGroup.
     *
     * @param id the id of the transactionGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the transactionGroup, or with status 404 (Not Found)
     */
    @GetMapping("/transaction-groups/{id}")
    @Timed
    public ResponseEntity<TransactionGroup> getTransactionGroup(@PathVariable Long id) {
        log.debug("REST request to get TransactionGroup : {}", id);
        Optional<TransactionGroup> transactionGroup = transactionGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(transactionGroup);
    }

    /**
     * DELETE  /transaction-groups/:id : delete the "id" transactionGroup.
     *
     * @param id the id of the transactionGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/transaction-groups/{id}")
    @Timed
    public ResponseEntity<Void> deleteTransactionGroup(@PathVariable Long id) {
        log.debug("REST request to delete TransactionGroup : {}", id);

        transactionGroupRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/transaction-groups/batched/{ids}")
    @Timed
    public ResponseEntity<Void> deleteTransactionGroups(@PathVariable String ids) {
        log.debug("REST request the following TransactionGroup ids are marked for deletion: {}", ids);
        List<TransactionGroup> transactionGroups = transactionGroupRepository.findAllById(
            Arrays.stream(ids.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList()));
        transactionGroupRepository.deleteAll(transactionGroups);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, ids)).build();
    }
}
