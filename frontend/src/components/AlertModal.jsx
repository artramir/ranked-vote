import './AlertModal.css'

function AlertModal({ message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="alert-modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}

export default AlertModal
