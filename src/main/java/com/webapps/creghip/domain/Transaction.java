package com.webapps.creghip.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Transaction.
 */
@Entity
@Table(name = "transaction")
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount_in", precision = 10, scale = 2)
    private BigDecimal amountIn;

    @Column(name = "amount_out", precision = 10, scale = 2)
    private BigDecimal amountOut;

    @NotNull
    @Column(name = "transaction_date", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy.MM.dd")
    private LocalDate transactionDate;

    @Column
    private String remark;

    @NotNull
    @ManyToOne
    @JsonIgnoreProperties("transactions")
    private TransactionGroup transactionGroup;

    @ManyToOne
    private ExchangeEntry exchangeEntry;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmountIn() {
        return amountIn;
    }

    public Transaction amountIn(BigDecimal amountIn) {
        this.amountIn = amountIn;
        return this;
    }

    public void setAmountIn(BigDecimal amountIn) {
        this.amountIn = amountIn;
    }

    public BigDecimal getAmountOut() {
        return amountOut;
    }

    public Transaction amountOut(BigDecimal amountOut) {
        this.amountOut = amountOut;
        return this;
    }

    public void setAmountOut(BigDecimal amountOut) {
        this.amountOut = amountOut;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public Transaction transactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
        return this;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getRemark() {
        return remark;
    }

    public Transaction remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public ExchangeEntry getExchangeEntry() {
        return exchangeEntry;
    }

    public Transaction exchangeEntry(ExchangeEntry exchangeEntry) {
        this.exchangeEntry = exchangeEntry;
        return this;
    }

    public void setExchangeEntry(ExchangeEntry exchangeEntry) {
        this.exchangeEntry = exchangeEntry;
    }

    public TransactionGroup getTransactionGroup() {
        return transactionGroup;
    }

    public Transaction transactionGroup(TransactionGroup transactionGroup) {
        this.transactionGroup = transactionGroup;
        return this;
    }

    public void setTransactionGroup(TransactionGroup transactionGroup) {
        this.transactionGroup = transactionGroup;
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
        Transaction transaction = (Transaction) o;
        if (transaction.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), transaction.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", amountIn=" + getAmountIn() +
            ", amountOut=" + getAmountOut() +
            ", transactionDate='" + getTransactionDate() + "'" +
            ", remark='" + getRemark() + "'" +
            ", exchangeEntry.id=" + (getExchangeEntry() != null ? getExchangeEntry().getId().toString() : "null") +
            ", transactionGroup.id=" + getTransactionGroup().getId().toString() +
            "}";
    }
}
