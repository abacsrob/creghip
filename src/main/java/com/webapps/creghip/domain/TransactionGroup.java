package com.webapps.creghip.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A TransactionGroup.
 */
@Entity
@Table(name = "transaction_group")
public class TransactionGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "transactionGroup")
    private Set<Transaction> transactions = new HashSet<>();

    @NotNull
    @ManyToOne
    @JsonIgnoreProperties("transactionGroups")
    private UserAccount userAccount;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public TransactionGroup name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Transaction> getTransactions() {
        return transactions;
    }

    public TransactionGroup transactions(Set<Transaction> transactions) {
        this.transactions = transactions;
        return this;
    }

    public TransactionGroup addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setTransactionGroup(this);
        return this;
    }

    public TransactionGroup removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setTransactionGroup(null);
        return this;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public TransactionGroup userAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
        return this;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TransactionGroup transactionGroup = (TransactionGroup) o;
        if (transactionGroup.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), transactionGroup.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TransactionGroup{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
