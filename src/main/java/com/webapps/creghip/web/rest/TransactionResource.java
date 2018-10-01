package com.webapps.creghip.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.webapps.creghip.domain.Transaction;
import com.webapps.creghip.repository.TransactionRepository;
import com.webapps.creghip.web.rest.errors.BadRequestAlertException;
import com.webapps.creghip.web.rest.util.HeaderUtil;
import com.webapps.creghip.web.rest.util.PaginationUtil;
import com.webapps.creghip.web.rest.validation.TransactionAmountValidator;
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
 * REST controller for managing Transaction.
 */
@RestController
@RequestMapping("/api")
public class TransactionResource {

    private final Logger log = LoggerFactory.getLogger(TransactionResource.class);

    private static final String ENTITY_NAME = "transaction";

    private final TransactionRepository transactionRepository;

    private final TransactionAmountValidator transactionAmountValidator;

    public TransactionResource(TransactionRepository transactionRepository, TransactionAmountValidator transactionAmountValidator) {
        this.transactionRepository = transactionRepository;
        this.transactionAmountValidator = transactionAmountValidator;
    }

    /**
     * POST  /transactions : Create a new transaction.
     *
     * @param transaction the transaction to create
     * @return the ResponseEntity with status 201 (Created) and with body the new transaction, or with status 400 (Bad Request) if the transaction has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/transactions")
    @Timed
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) throws URISyntaxException {
        log.debug("REST request to save Transaction : {}", transaction);
        if (transaction.getId() != null) {
            throw new BadRequestAlertException("A new transaction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (!transactionAmountValidator.isValid(transaction)) {
            throw new BadRequestAlertException("Transaction amount invalid!", ENTITY_NAME, "amountinvalid");
        }
        Transaction result = transactionRepository.save(transaction);
        return ResponseEntity.created(new URI("/api/transactions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /transactions : Updates an existing transaction.
     *
     * @param transaction the transaction to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated transaction,
     * or with status 400 (Bad Request) if the transaction is not valid,
     * or with status 500 (Internal Server Error) if the transaction couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/transactions")
    @Timed
    public ResponseEntity<Transaction> updateTransaction(@Valid @RequestBody Transaction transaction) throws URISyntaxException {
        log.debug("REST request to update Transaction : {}", transaction);
        if (transaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!transactionAmountValidator.isValid(transaction)) {
            throw new BadRequestAlertException("Transaction amount invalid!", ENTITY_NAME, "amountinvalid");
        }
        Transaction result = transactionRepository.save(transaction);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, transaction.getId().toString()))
            .body(result);
    }

    /**
     * GET  /transactions : get all the transactions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of transactions in body
     */
    @GetMapping("/transactions")
    @Timed
    public ResponseEntity<List<Transaction>> getAllTransactions(Pageable pageable) {
        log.debug("REST request to get a page of Transactions");
        Page<Transaction> page = transactionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/transactions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/transactions/excluding/{id}")
    @Timed
    public List<Transaction> getAllTransactionsExcluding(@PathVariable Long id) {
        log.debug("REST request to get all Transactions excluding");
        return transactionRepository.findAll()
            .stream().filter(transaction -> !transaction.getId().equals(id)).collect(Collectors.toList());
    }

    /**
     * GET  /transactions/:id : get the "id" transaction.
     *
     * @param id the id of the transaction to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the transaction, or with status 404 (Not Found)
     */
    @GetMapping("/transactions/{id}")
    @Timed
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) {
        log.debug("REST request to get Transaction : {}", id);
        Optional<Transaction> transaction = transactionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(transaction);
    }

    /**
     * DELETE  /transactions/:id : delete the "id" transaction.
     *
     * @param id the id of the transaction to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/transactions/{id}")
    @Timed
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        log.debug("REST request to delete Transaction : {}", id);
        transactionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/transactions/batched/{ids}")
    @Timed
    public ResponseEntity<Void> deleteTransactions(@PathVariable String ids) {
        log.debug("REST request the following Transaction ids are marked for deletion: {}", ids);
        List<Transaction> transactions = transactionRepository.findAllById(
            Arrays.stream(ids.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList()));
        transactionRepository.deleteAll(transactions);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, ids)).build();
    }
}
