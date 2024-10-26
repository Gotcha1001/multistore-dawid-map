"use client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAdButton({ id }: { id: string }) {
  const [showDeleteQuestion, setShowDeleteQuestion] = useState(false);

  const router = useRouter();

  function handleDelete() {
    fetch(`/api/ads?id=${id}`, {
      method: "DELETE",
    }).then(() => {
      setShowDeleteQuestion(false);
      router.push("/");
    });
  }

  if (showDeleteQuestion) {
    return (
      <div className="bg-black/90 fixed inset-0 z-50 flex items-center justify-center">
        <div className="gradient-background5 p-8 rounded-2xl">
          <h2 className="text-lg font-bold">
            Are You Sure You Want To Remove This Item Forever
          </h2>
          <div className="flex justify-center gap-2 mt-2">
            <button
              className="py-1 px-2 border gradient-background2  text-white rounded-lg"
              onClick={() => setShowDeleteQuestion(false)}
            >
              Cancel
            </button>
            <button
              className="py-1 px-2 border gradient-background1 text-white rounded-lg"
              onClick={handleDelete}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowDeleteQuestion(true)}
      className="border border-red-600 text-red-600 rounded-md py-1 px-4 inline-flex gap-2 items-center cursor-pointer"
    >
      <FontAwesomeIcon icon={faTrash} />
      <span> Delete</span>
    </button>
  );
}
