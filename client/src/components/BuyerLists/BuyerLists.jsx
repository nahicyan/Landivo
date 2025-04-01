import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PuffLoader } from "react-spinners";

// Import custom hooks
import { useBuyerLists } from "./hooks/useBuyerLists";
import { useBuyers } from "./hooks/useBuyers";

// Import components
import BuyerListsTable from "./BuyerListsTable";
import CreateListForm from "./CreateListForm";
import EditListForm from "./EditListForm";
import EmailForm from "./EmailForm";
import AddBuyersDialog from "./AddBuyersDialog";
import ManageMembersDialog from "./ManageMembersDialog";
import ImportCsvDialog from "./ImportCsvDialog";

export default function BuyerLists() {
  // State for dialogs and selected list
  const [createListOpen, setCreateListOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [addBuyersOpen, setAddBuyersOpen] = useState(false);
  const [manageBuyersOpen, setManageBuyersOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use custom hooks for data fetching and management
  const {
    lists,
    filteredLists,
    loading: listsLoading,
    createList,
    updateList,
    deleteList,
    sendEmail,
    addBuyersToList,
    removeBuyersFromList,
    setListFilters,
  } = useBuyerLists();

  const {
    buyers,
    availableBuyers,
    loading: buyersLoading,
    error: buyersError,
  } = useBuyers();

  // Handle search input changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setListFilters({ search: value });
  };

  // Handle opening the create list dialog
  const handleNewList = () => {
    setCreateListOpen(true);
  };

  // Handle opening the edit list dialog
  const handleEditList = (listId) => {
    setSelectedList(listId);
    setEditListOpen(true);
  };

  // Handle opening the email dialog
  const handleEmailList = (listId) => {
    setSelectedList(listId);
    setEmailDialogOpen(true);
  };

  // Handle opening the add buyers dialog
  const handleAddBuyers = (listId) => {
    setSelectedList(listId);
    setAddBuyersOpen(true);
  };

  // Handle opening the manage members dialog
  const handleManageMembers = (listId) => {
    setSelectedList(listId);
    setManageBuyersOpen(true);
  };

  // Loading state
  if (listsLoading || buyersLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#324c48] mb-2">Buyer Lists</h1>
        <p className="text-gray-600">
          Create and manage lists of buyers grouped by area and type for targeted emails
        </p>
      </div>

      {/* Main Content */}
      <Card className="border-[#324c48]/20">
        {/* Table with search and actions */}
        <BuyerListsTable
          lists={filteredLists}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onNewList={handleNewList}
          onEditList={handleEditList}
          onEmailList={handleEmailList}
          onAddBuyers={handleAddBuyers}
          onManageMembers={handleManageMembers}
          onDeleteList={deleteList}
          className="w-full"
        />
      </Card>

      {/* Dialogs */}
      <CreateListForm
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onCreateList={createList}
        onImportCsv={() => setCsvUploadOpen(true)}
      />

      <EditListForm
        open={editListOpen}
        onOpenChange={setEditListOpen}
        selectedList={selectedList ? lists.find(l => l.id === selectedList) : null}
        onUpdateList={updateList}
        onImportCsv={() => setCsvUploadOpen(true)}
      />

      <EmailForm
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedList={selectedList ? lists.find(l => l.id === selectedList) : null}
        onSendEmail={(emailData) => sendEmail(selectedList, emailData)}
      />

      <AddBuyersDialog
        open={addBuyersOpen}
        onOpenChange={setAddBuyersOpen}
        selectedList={selectedList ? lists.find(l => l.id === selectedList) : null}
        availableBuyers={availableBuyers}
        onAddBuyers={(buyerIds) => addBuyersToList(selectedList, buyerIds)}
        onImportCsv={() => setCsvUploadOpen(true)}
      />

      <ManageMembersDialog
        open={manageBuyersOpen}
        onOpenChange={setManageBuyersOpen}
        selectedList={selectedList ? lists.find(l => l.id === selectedList) : null}
        onRemoveMembers={(buyerIds) => removeBuyersFromList(selectedList, buyerIds)}
        onAddBuyers={() => setAddBuyersOpen(true)}
      />

      <ImportCsvDialog
        open={csvUploadOpen}
        onOpenChange={setCsvUploadOpen}
        onImport={(csvData, options) => {
          // Handle CSV import based on context
          if (selectedList) {
            // Add to existing list
            addBuyersToList(selectedList, csvData.map(buyer => buyer.id));
          } else if (createListOpen) {
            // For new list creation - store data to be used after list creation
            // This would be handled in the createList flow
            setCsvUploadOpen(false);
          }
        }}
      />
    </div>
  );
}