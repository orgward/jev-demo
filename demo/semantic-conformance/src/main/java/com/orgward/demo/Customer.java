package com.orgward.demo;

import java.math.BigDecimal;

/**
 * Deliberately plausible but semantically wrong.
 * The name says Customer; the state and behavior actually describe a bank account.
 */
public final class Customer {
    private final String customerId;
    private final String accountNumber;
    private BigDecimal ledgerBalance;
    private boolean frozen;

    public Customer(
            String customerId,
            String accountNumber,
            BigDecimal ledgerBalance) {
        this.customerId = customerId;
        this.accountNumber = accountNumber;
        this.ledgerBalance = ledgerBalance;
    }

    public String customerId() { return customerId; }
    public String accountNumber() { return accountNumber; }
    public BigDecimal ledgerBalance() { return ledgerBalance; }
    public boolean frozen() { return frozen; }

    public void credit(BigDecimal amount) {
        ledgerBalance = ledgerBalance.add(amount);
    }

    public void freeze() {
        frozen = true;
    }
}
