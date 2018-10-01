package com.webapps.creghip.web.rest.validation;

import com.webapps.creghip.domain.Transaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TransactionAmountValidator {

    public boolean isValid(Transaction transaction) {
        boolean amountInValid = transaction.getAmountIn() != null && transaction.getAmountIn().compareTo(BigDecimal.ZERO) > 0;
        boolean amountOutValid = transaction.getAmountOut() != null && transaction.getAmountOut().compareTo(BigDecimal.ZERO) > 0;

        if ((amountInValid && !amountOutValid) || (!amountInValid && amountOutValid)) {
            return true;
        }
        return false;
    }
}
