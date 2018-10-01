package com.webapps.creghip.web.rest;

import com.webapps.creghip.CreghipApp;
import com.webapps.creghip.domain.TransactionGroup;
import com.webapps.creghip.repository.TransactionGroupRepository;
import com.webapps.creghip.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.webapps.creghip.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TransactionGroupResource REST controller.
 *
 * @see TransactionGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CreghipApp.class)
public class TransactionGroupResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private TransactionGroupRepository transactionGroupRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTransactionGroupMockMvc;

    private TransactionGroup transactionGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TransactionGroupResource transactionGroupResource = new TransactionGroupResource(transactionGroupRepository);
        this.restTransactionGroupMockMvc = MockMvcBuilders.standaloneSetup(transactionGroupResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TransactionGroup createEntity(EntityManager em) {
        TransactionGroup transactionGroup = new TransactionGroup()
            .name(DEFAULT_NAME);
        return transactionGroup;
    }

    @Before
    public void initTest() {
        transactionGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createTransactionGroup() throws Exception {
        int databaseSizeBeforeCreate = transactionGroupRepository.findAll().size();

        // Create the TransactionGroup
        restTransactionGroupMockMvc.perform(post("/api/transaction-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transactionGroup)))
            .andExpect(status().isCreated());

        // Validate the TransactionGroup in the database
        List<TransactionGroup> transactionGroupList = transactionGroupRepository.findAll();
        assertThat(transactionGroupList).hasSize(databaseSizeBeforeCreate + 1);
        TransactionGroup testTransactionGroup = transactionGroupList.get(transactionGroupList.size() - 1);
        assertThat(testTransactionGroup.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createTransactionGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transactionGroupRepository.findAll().size();

        // Create the TransactionGroup with an existing ID
        transactionGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransactionGroupMockMvc.perform(post("/api/transaction-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transactionGroup)))
            .andExpect(status().isBadRequest());

        // Validate the TransactionGroup in the database
        List<TransactionGroup> transactionGroupList = transactionGroupRepository.findAll();
        assertThat(transactionGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = transactionGroupRepository.findAll().size();
        // set the field null
        transactionGroup.setName(null);

        // Create the TransactionGroup, which fails.

        restTransactionGroupMockMvc.perform(post("/api/transaction-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transactionGroup)))
            .andExpect(status().isBadRequest());

        List<TransactionGroup> transactionGroupList = transactionGroupRepository.findAll();
        assertThat(transactionGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTransactionGroups() throws Exception {
        // Initialize the database
        transactionGroupRepository.saveAndFlush(transactionGroup);

        // Get all the transactionGroupList
        restTransactionGroupMockMvc.perform(get("/api/transaction-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transactionGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getTransactionGroup() throws Exception {
        // Initialize the database
        transactionGroupRepository.saveAndFlush(transactionGroup);

        // Get the transactionGroup
        restTransactionGroupMockMvc.perform(get("/api/transaction-groups/{id}", transactionGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(transactionGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTransactionGroup() throws Exception {
        // Get the transactionGroup
        restTransactionGroupMockMvc.perform(get("/api/transaction-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTransactionGroup() throws Exception {
        // Initialize the database
        transactionGroupRepository.saveAndFlush(transactionGroup);

        int databaseSizeBeforeUpdate = transactionGroupRepository.findAll().size();

        // Update the transactionGroup
        TransactionGroup updatedTransactionGroup = transactionGroupRepository.findById(transactionGroup.getId()).get();
        // Disconnect from session so that the updates on updatedTransactionGroup are not directly saved in db
        em.detach(updatedTransactionGroup);
        updatedTransactionGroup
            .name(UPDATED_NAME);

        restTransactionGroupMockMvc.perform(put("/api/transaction-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransactionGroup)))
            .andExpect(status().isOk());

        // Validate the TransactionGroup in the database
        List<TransactionGroup> transactionGroupList = transactionGroupRepository.findAll();
        assertThat(transactionGroupList).hasSize(databaseSizeBeforeUpdate);
        TransactionGroup testTransactionGroup = transactionGroupList.get(transactionGroupList.size() - 1);
        assertThat(testTransactionGroup.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingTransactionGroup() throws Exception {
        int databaseSizeBeforeUpdate = transactionGroupRepository.findAll().size();

        // Create the TransactionGroup

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransactionGroupMockMvc.perform(put("/api/transaction-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transactionGroup)))
            .andExpect(status().isBadRequest());

        // Validate the TransactionGroup in the database
        List<TransactionGroup> transactionGroupList = transactionGroupRepository.findAll();
        assertThat(transactionGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTransactionGroup() throws Exception {
        // Initialize the database
        transactionGroupRepository.saveAndFlush(transactionGroup);

        int databaseSizeBeforeDelete = transactionGroupRepository.findAll().size();

        // Get the transactionGroup
        restTransactionGroupMockMvc.perform(delete("/api/transaction-groups/{id}", transactionGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TransactionGroup> transactionGroupList = transactionGroupRepository.findAll();
        assertThat(transactionGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TransactionGroup.class);
        TransactionGroup transactionGroup1 = new TransactionGroup();
        transactionGroup1.setId(1L);
        TransactionGroup transactionGroup2 = new TransactionGroup();
        transactionGroup2.setId(transactionGroup1.getId());
        assertThat(transactionGroup1).isEqualTo(transactionGroup2);
        transactionGroup2.setId(2L);
        assertThat(transactionGroup1).isNotEqualTo(transactionGroup2);
        transactionGroup1.setId(null);
        assertThat(transactionGroup1).isNotEqualTo(transactionGroup2);
    }
}
