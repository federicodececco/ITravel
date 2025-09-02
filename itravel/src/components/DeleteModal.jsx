import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Elimina Elemento',
  itemName,
  description,
  warningText = 'Questa azione è irreversibile.',
  confirmText = 'Elimina',
  cancelText = 'Annulla',
  loadingText = 'Eliminando...',
  variant = 'danger',
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonBg: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonBg: 'bg-blue-600 hover:bg-blue-700',
        };
      default:
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonBg: 'bg-red-600 hover:bg-red-700',
        };
    }
  };

  const styles = getVariantStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 font-[Playfair_Display]'
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className='bg-[#e6d3b3] rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all'>
        <div className='flex justify-between items-start mb-4'>
          <div></div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Chiudi modal'
          >
            <X size={20} />
          </button>
        </div>

        <div className='text-center mb-6'>
          <div
            className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {variant === 'danger' ? (
              <AlertTriangle className={`${styles.iconColor}`} size={28} />
            ) : variant === 'warning' ? (
              <AlertTriangle className={`${styles.iconColor}`} size={28} />
            ) : (
              <Trash2 className={`${styles.iconColor}`} size={28} />
            )}
          </div>

          <h3 className='text-2xl font-bold text-gray-800 mb-2'>{title}</h3>

          {itemName && (
            <p className='text-gray-600 mb-2'>
              Sei sicuro di voler eliminare "<strong>{itemName}</strong>"?
            </p>
          )}

          {description && <p className='text-gray-600 mb-2'>{description}</p>}

          {warningText && (
            <p className='text-gray-500 text-sm mt-2'>{warningText}</p>
          )}
        </div>

        <div className='flex gap-3'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 ${styles.buttonBg} text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                {loadingText}
              </>
            ) : (
              <>
                <Trash2 size={16} />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
