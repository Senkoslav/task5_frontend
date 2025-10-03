"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { userAPI } from "@/services/api";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ToolbarProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

type ModalAction = "block" | "unblock" | "delete" | "deleteUnverified" | null;

export default function Toolbar({
  onSuccess,
  onError,
  onRefresh,
}: ToolbarProps) {
  const { users, selectedUsers, deselectAllUsers } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const validateAction = (action: ModalAction): boolean => {
    if (selectedUsers.length === 0) {
      onError("Please select users first");
      return false;
    }

    const selectedUserObjects = users.filter((user) =>
      selectedUsers.includes(user.id)
    );

    if (action === "block") {
      const alreadyBlocked = selectedUserObjects.filter(
        (user) => user.status === "BLOCKED"
      );
      if (alreadyBlocked.length === selectedUsers.length) {
        onError("All selected users are already blocked");
        return false;
      }
      if (alreadyBlocked.length > 0) {
        onError(
          `${alreadyBlocked.length} of the selected users are already blocked`
        );
        return false;
      }
    }

    if (action === "unblock") {
      const notBlocked = selectedUserObjects.filter(
        (user) => user.status !== "BLOCKED"
      );
      if (notBlocked.length === selectedUsers.length) {
        onError("None of the selected users are blocked");
        return false;
      }
      if (notBlocked.length > 0) {
        onError(
          `${notBlocked.length} of the selected users are not blocked`
        );
        return false;
      }
    }

    return true;
  };

  const openModal = (action: ModalAction) => {
    if (action !== "deleteUnverified" && !validateAction(action)) {
      return;
    }
    setModalAction(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleConfirm = async () => {
    if (!modalAction) return;

    closeModal();
    setLoading(true);

    try {
      let response;
      let successMessage = "";

      switch (modalAction) {
        case "block":
          response = await userAPI.blockUsers({ userIds: selectedUsers });
          successMessage = `${response.data.count} user(s) blocked successfully`;
          break;
        case "unblock":
          response = await userAPI.unblockUsers({ userIds: selectedUsers });
          successMessage = `${response.data.count} user(s) unblocked successfully`;
          break;
        case "delete":
          response = await userAPI.deleteUsers({ userIds: selectedUsers });
          successMessage = `${response.data.count} user(s) deleted successfully`;
          break;
        case "deleteUnverified":
          response = await userAPI.deleteUnverifiedUsers();
          successMessage = `${response.data.count} unverified user(s) deleted successfully`;
          break;
      }

      onSuccess(successMessage);
      deselectAllUsers();
      onRefresh();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      onError(error.response?.data?.error || `Failed to ${modalAction} users`);
    } finally {
      setLoading(false);
    }
  };

  const getModalConfig = () => {
    switch (modalAction) {
      case "block":
        return {
          title: "Block Users",
          message: `Are you sure you want to block ${selectedUsers.length} selected user(s)?`,
          confirmText: "Block",
          variant: "warning" as const,
        };
      case "unblock":
        return {
          title: "Unblock Users",
          message: `Are you sure you want to unblock ${selectedUsers.length} selected user(s)?`,
          confirmText: "Unblock",
          variant: "primary" as const,
        };
      case "delete":
        return {
          title: "Delete Users",
          message: `Are you sure you want to delete ${selectedUsers.length} selected user(s)? This action cannot be undone.`,
          confirmText: "Delete",
          variant: "danger" as const,
        };
      case "deleteUnverified":
        return {
          title: "Delete Unverified Users",
          message: "Are you sure you want to delete ALL unverified users? This action cannot be undone.",
          confirmText: "Delete All Unverified",
          variant: "danger" as const,
        };
      default:
        return {
          title: "",
          message: "",
          confirmText: "Confirm",
          variant: "primary" as const,
        };
    }
  };

  const isDisabled = loading || selectedUsers.length === 0;
  const modalConfig = getModalConfig();

  return (
    <>
      <div className="toolbar d-flex align-items-center gap-2">
        <button
          className="btn btn-outline-warning"
          disabled={isDisabled}
          onClick={() => openModal("block")}
          title="Block selected users"
        >
          <i className="bi bi-lock"></i> Block
        </button>

        <button
          className="btn btn-outline-success"
          disabled={isDisabled}
          onClick={() => openModal("unblock")}
          title="Unblock selected users"
        >
          <i className="bi bi-unlock"></i> Unblock
        </button>

        <button
          className="btn btn-outline-danger"
          disabled={isDisabled}
          onClick={() => openModal("delete")}
          title="Delete selected users"
        >
          <i className="bi bi-trash"></i> Delete
        </button>

        <div className="vr"></div>

        <button
          className="btn btn-warning text-dark"
          disabled={loading}
          onClick={() => openModal("deleteUnverified")}
          title="Delete all unverified users"
        >
          <i className="bi bi-trash"></i> Delete Unverified
        </button>

        <div className="ms-auto">
          <small className="text-muted">
            {selectedUsers.length > 0 &&
              `${selectedUsers.length} user(s) selected`}
          </small>
        </div>
      </div>

      <ConfirmModal
        show={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        variant={modalConfig.variant}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </>
  );
}
