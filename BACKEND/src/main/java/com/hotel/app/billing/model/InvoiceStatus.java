package com.hotel.app.billing.model;

/**
 * Represents the status of an invoice in the billing system.
 */
public enum InvoiceStatus {
    PENDING,    // Invoice has been issued but not yet paid
    PAID,       // Invoice has been fully paid
    OVERDUE,    // Invoice is past its due date and not fully paid
    CANCELLED   // Invoice has been cancelled
}
