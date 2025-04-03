/**
 * Main exports for the BuyersTable module
 */

// Export the main container component as default
export { default } from './BuyersContainer';

// Export individual components for potential standalone use
export { default as BuyersTable } from './BuyersTable';
export { default as BuyerStats } from './BuyerStats';
export { default as BuyerAreasTab } from './BuyerAreasTab';
export { default as ActivityDetailView } from './ActivityDetailView';

// Export constants and utility functions
export * from './buyerConstants';
export * from './activityUtils';