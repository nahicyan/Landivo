// Main exports for the BuyerLists module
import BuyerLists from './BuyerLists';

// Re-export for easy imports
export default BuyerLists;

// Also export individual components for potential standalone use
export { default as BuyerListsTable } from './components/BuyerListsTable';
export { default as CreateListForm } from './components/CreateListForm';
export { default as EditListForm } from './components/EditListForm';
export { default as EmailForm } from './components/EmailForm';
export { default as AddBuyersDialog } from './components/AddBuyersDialog';
export { default as ManageMembersDialog } from './components/ManageMembersDialog';
export { default as ImportCsvDialog } from './components/ImportCsvDialog';

// Export hooks
export { useBuyerLists } from './hooks/useBuyerLists';
export { useBuyers } from './hooks/useBuyers';
export { useCsvImport } from './hooks/useCsvImport';

// Export utilities
export * from './utils/buyerListUtils';