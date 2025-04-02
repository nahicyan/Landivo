/**
 * Entry point for the Buyers module
 * Exports all components to make imports cleaner for consuming code
 */

export { default } from './BuyersContainer';
export { default as BuyersTable } from './BuyersTable';
export { default as BuyerStats } from './BuyerStats';
export { default as BuyerAreasTab } from './BuyerAreasTab';
export * from './buyerConstants';