import { CircleX } from 'lucide-react';
import '../styles/DeletePopUp.css';

function DeletePopUp({ setIsDeletePopUpOpen, setIsDeleteConfirm }: any) {
  return (
    <div className="popup-header">
      <div className="popup-container">
        <button className="popup-close-button" onClick={() => setIsDeletePopUpOpen(false)}>
          <CircleX size={24} />
        </button>
        <div className="popup-content">
          <h1 className="popup-title">Are you sure you want to delete?</h1>
          <p className="popup-message">
            If you delete this employee, you will not be able to recover it.
          </p>
          <div className="popup-actions">
            <button className="popup-delete-btn" onClick={() => setIsDeleteConfirm(true)}>
              Delete
            </button>
            <button className="popup-cancel-btn" onClick={() => setIsDeletePopUpOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePopUp;
