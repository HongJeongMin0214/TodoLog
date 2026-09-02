import { useEffect } from 'react'
import './DeleteCategoryDialog.css'

interface DeleteCategoryDialogProps {
  categoryName: string
  todoCount: number
  onDeleteTodos: () => void // 카테고리와 그 안의 할 일을 함께 삭제
  onMoveTodos: () => void // 할 일은 기본 "할 일" 카테고리로 옮기고 카테고리만 삭제
  onCancel: () => void
}

function DeleteCategoryDialog({
  categoryName,
  todoCount,
  onDeleteTodos,
  onMoveTodos,
  onCancel,
}: DeleteCategoryDialogProps) {
  // Esc 로 취소
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const hasTodos = todoCount > 0

  return (
    <div className="delete-category-dialog__overlay" onClick={onCancel}>
      <div
        className="delete-category-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // 박스 안 클릭은 닫힘으로 이어지지 않게
      >
        <p className="delete-category-dialog__message">
          {hasTodos ? (
            <>
              &lsquo;{categoryName}&rsquo;에 있는 할 일 {todoCount}개를 어떻게
              할까요?
            </>
          ) : (
            <>&lsquo;{categoryName}&rsquo; 카테고리를 삭제할까요?</>
          )}
        </p>

        <div className="delete-category-dialog__actions">
          {hasTodos ? (
            <>
              <button
                type="button"
                className="delete-category-dialog__btn--danger"
                onClick={onDeleteTodos}
              >
                함께 삭제
              </button>
              <button type="button" onClick={onMoveTodos}>
                &lsquo;할 일&rsquo;로 이동
              </button>
              <button type="button" onClick={onCancel}>
                취소
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="delete-category-dialog__btn--danger"
                onClick={onDeleteTodos}
              >
                삭제
              </button>
              <button type="button" onClick={onCancel}>
                취소
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeleteCategoryDialog
