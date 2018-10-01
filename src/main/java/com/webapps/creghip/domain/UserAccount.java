package com.webapps.creghip.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A UserAccount.
 */
@Entity
@Table(name = "user_account")
public class UserAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "account_name", length = 100, nullable = false)
    private String accountName;

    @NotNull
    @OneToOne
    @JoinColumn(unique = true)
    private Currency currency;

    @JsonIgnore
    @OneToMany(mappedBy = "userAccount")
    private Set<TransactionGroup> transactionGroups = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountName() {
        return accountName;
    }

    public UserAccount accountName(String accountName) {
        this.accountName = accountName;
        return this;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public Currency getCurrency() {
        return currency;
    }

    public UserAccount currency(Currency currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Set<TransactionGroup> getTransactionGroups() {
        return transactionGroups;
    }

    public UserAccount transactionGroups(Set<TransactionGroup> transactionGroups) {
        this.transactionGroups = transactionGroups;
        return this;
    }

    public UserAccount addTransactionGroup(TransactionGroup transactionGroup) {
        this.transactionGroups.add(transactionGroup);
        transactionGroup.setUserAccount(this);
        return this;
    }

    public UserAccount removeTransactionGroup(TransactionGroup transactionGroup) {
        this.transactionGroups.remove(transactionGroup);
        transactionGroup.setUserAccount(null);
        return this;
    }

    public void setTransactionGroups(Set<TransactionGroup> transactionGroups) {
        this.transactionGroups = transactionGroups;
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
        UserAccount userAccount = (UserAccount) o;
        if (userAccount.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userAccount.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserAccount{" +
            "id=" + getId() +
            ", accountName='" + getAccountName() + "'" +
            "}";
    }
}
