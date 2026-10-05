"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useUsers } from "@/hooks/useUsers";
import { getErrorMessage } from "@/lib/utils/errors";
import { SuccessMessages } from "@/lib/constants/errorMessages";
import { AppRoutes } from "@/lib/constants/routes";
import { Pagination } from "@/components/common/Pagination";
import { Spinner } from "@/components/common/Spinner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { UsersTable } from "@/components/users/UsersTable";
import { UserFormModal, type UserFormValues } from "@/components/users/UserFormModal";
import { OrganizationFilterSelect } from "@/components/users/OrganizationFilterSelect";
import type { User } from "@/lib/types/user";

export function UsersPageContent() {
  const { isSuperAdmin } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const organizationIdParam = searchParams.get("organizationId");
  const organizationId = organizationIdParam ? Number(organizationIdParam) : undefined;

  const {
    users,
    page,
    pageSize,
    totalCount,
    isLoading,
    error,
    setPage,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers(organizationId);

  const [formUser, setFormUser] = useState<User | null | "new">(null);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleOrganizationFilterChange(nextOrganizationId: number | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextOrganizationId) {
      params.set("organizationId", String(nextOrganizationId));
    } else {
      params.delete("organizationId");
    }
    router.push(`${AppRoutes.users}?${params.toString()}`);
  }

  async function handleFormSubmit(values: UserFormValues) {
    setIsSavingForm(true);
    try {
      if (formUser && formUser !== "new") {
        await updateUser(formUser.id, values);
        showSuccess(SuccessMessages.USER_UPDATED);
      } else {
        await createUser(values);
        showSuccess(SuccessMessages.USER_CREATED);
      }
      setFormUser(null);
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
      await deleteUser(pendingDelete.id);
      showSuccess(SuccessMessages.USER_DELETED);
      setPendingDelete(null);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <OrganizationFilterSelect value={organizationId} onChange={handleOrganizationFilterChange} />
          )}
          <button
            type="button"
            onClick={() => setFormUser("new")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add user
          </button>
        </div>
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
              <UsersTable
                users={users}
                isSuperAdmin={isSuperAdmin}
                onEdit={setFormUser}
                onDelete={setPendingDelete}
              />
            </div>
            <Pagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
          </>
        )}
      </div>

      <UserFormModal
        open={formUser !== null}
        user={formUser && formUser !== "new" ? formUser : null}
        isSuperAdmin={isSuperAdmin}
        isSubmitting={isSavingForm}
        onSubmit={handleFormSubmit}
        onClose={() => setFormUser(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete user"
        description={`Are you sure you want to delete "${pendingDelete?.firstName} ${pendingDelete?.lastName}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
