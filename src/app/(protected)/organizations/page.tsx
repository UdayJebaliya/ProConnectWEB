"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useQboConnect } from "@/hooks/useQboConnect";
import { getErrorMessage } from "@/lib/utils/errors";
import { SuccessMessages } from "@/lib/constants/errorMessages";
import { Pagination } from "@/components/common/Pagination";
import { Spinner } from "@/components/common/Spinner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { OrganizationsTable } from "@/components/organizations/OrganizationsTable";
import {
  OrganizationFormModal,
  type OrganizationFormValues,
} from "@/components/organizations/OrganizationFormModal";
import type { Organization } from "@/lib/types/organization";

export default function OrganizationsPage() {
  const { isSuperAdmin } = useAuth();
  const { showSuccess, showError } = useToast();
  const {
    organizations,
    page,
    pageSize,
    totalCount,
    isLoading,
    error,
    setPage,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refetch,
  } = useOrganizations();
  const { connect, disconnect, connectingOrgId, disconnectingOrgId } = useQboConnect();

  const [formOrg, setFormOrg] = useState<Organization | null | "new">(null);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Organization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleFormSubmit(values: OrganizationFormValues) {
    setIsSavingForm(true);
    try {
      if (formOrg && formOrg !== "new") {
        await updateOrganization(formOrg.id, values);
        showSuccess(SuccessMessages.ORGANIZATION_UPDATED);
      } else {
        await createOrganization(values);
        showSuccess(SuccessMessages.ORGANIZATION_CREATED);
      }
      setFormOrg(null);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsSavingForm(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteOrganization(pendingDelete.id);
      showSuccess(SuccessMessages.ORGANIZATION_DELETED);
      setPendingDelete(null);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Organizations</h1>
        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => setFormOrg("new")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add organization
          </button>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center py-16 text-gray-400">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <p className="px-4 py-10 text-center text-sm text-red-600">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <OrganizationsTable
                organizations={organizations}
                isSuperAdmin={isSuperAdmin}
                connectingOrgId={connectingOrgId}
                disconnectingOrgId={disconnectingOrgId}
                onEdit={setFormOrg}
                onDelete={setPendingDelete}
                onConnect={(organization) => connect(organization.id)}
                onDisconnect={async (organization) => {
                  const success = await disconnect(organization.id);
                  if (success) await refetch();
                }}
              />
            </div>
            <Pagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
          </>
        )}
      </div>

      <OrganizationFormModal
        open={formOrg !== null}
        organization={formOrg && formOrg !== "new" ? formOrg : null}
        isSubmitting={isSavingForm}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOrg(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete organization"
        description={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
