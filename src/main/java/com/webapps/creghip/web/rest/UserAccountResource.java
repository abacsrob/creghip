package com.webapps.creghip.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.webapps.creghip.domain.UserAccount;
import com.webapps.creghip.repository.UserAccountRepository;
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
 * REST controller for managing UserAccount.
 */
@RestController
@RequestMapping("/api")
public class UserAccountResource {

    private final Logger log = LoggerFactory.getLogger(UserAccountResource.class);

    private static final String ENTITY_NAME = "userAccount";

    private final UserAccountRepository userAccountRepository;

    public UserAccountResource(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    /**
     * POST  /user-accounts : Create a new userAccount.
     *
     * @param userAccount the userAccount to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userAccount, or with status 400 (Bad Request) if the userAccount has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-accounts")
    @Timed
    public ResponseEntity<UserAccount> createUserAccount(@Valid @RequestBody UserAccount userAccount) throws URISyntaxException {
        log.debug("REST request to save UserAccount : {}", userAccount);
        if (userAccount.getId() != null) {
            throw new BadRequestAlertException("A new userAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserAccount result = userAccountRepository.save(userAccount);
        return ResponseEntity.created(new URI("/api/user-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-accounts : Updates an existing userAccount.
     *
     * @param userAccount the userAccount to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userAccount,
     * or with status 400 (Bad Request) if the userAccount is not valid,
     * or with status 500 (Internal Server Error) if the userAccount couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-accounts")
    @Timed
    public ResponseEntity<UserAccount> updateUserAccount(@Valid @RequestBody UserAccount userAccount) throws URISyntaxException {
        log.debug("REST request to update UserAccount : {}", userAccount);
        if (userAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserAccount result = userAccountRepository.save(userAccount);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userAccount.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-accounts : get all the userAccounts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of userAccounts in body
     */
    @GetMapping("/user-accounts")
    @Timed
    public ResponseEntity<List<UserAccount>> getAllUserAccounts(Pageable pageable) {
        log.debug("REST request to get a page of UserAccounts");
        Page<UserAccount> page = userAccountRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/user-accounts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /user-accounts/:id : get the "id" userAccount.
     *
     * @param id the id of the userAccount to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userAccount, or with status 404 (Not Found)
     */
    @GetMapping("/user-accounts/{id}")
    @Timed
    public ResponseEntity<UserAccount> getUserAccount(@PathVariable Long id) {
        log.debug("REST request to get UserAccount : {}", id);
        Optional<UserAccount> userAccount = userAccountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userAccount);
    }

    /**
     * DELETE  /user-accounts/:id : delete the "id" userAccount.
     *
     * @param id the id of the userAccount to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-accounts/{id}")
    @Timed
    public ResponseEntity<Void> deleteUserAccount(@PathVariable Long id) {
        log.debug("REST request to delete UserAccount : {}", id);

        userAccountRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/user-accounts/batched/{ids}")
    @Timed
    public ResponseEntity<Void> deleteUserAccounts(@PathVariable String ids) {
        log.debug("REST request the following UserAccount ids are marked for deletion: {}", ids);
        List<UserAccount> userAccounts = userAccountRepository.findAllById(
            Arrays.stream(ids.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList()));
        userAccountRepository.deleteAll(userAccounts);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, ids)).build();
    }
}
