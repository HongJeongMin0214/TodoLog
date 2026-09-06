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
  useEffect(() => { // 1. () => {} : 컴포넌트가 화면에 렌더링된 후 실행할 코드
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey) // 브라우저 창 전체에 keydown 이벤트 리스너 등록.
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel]) // 2. [] : 의존성 배열. []이면 처음 렌더링될 때만 실행. [onCancel]이면 onCancel이 바뀔 때마다 실행

  const hasTodos = todoCount > 0

  return (
    <div className="delete-category-dialog__overlay" onClick={onCancel}>
      <div
        className="delete-category-dialog"
        role="dialog"
        aria-modal="true"
        // 웹 브라우저는 자식 요소를 클릭하면 부모 요소에도 타고 올라가는데 이를 이벤트 버블링이라 함. e.stopPropagation(): 이벤트 버블링을 막아 부모 요소의 onClick이 실행되지 않음.
        // 모달 내부를 클릭했는데도 클릭 이벤트가 부모인 뒷 배경을 타고 올라가서 모달 창이 꺼짐. e.stopPropargation을 쓰면 모달 내부를 클릭할 때 클린 신호가 바깥 배경으로 전달되지 않아 모달이 꺼지지 않음. 오직 바깥 배경을 클릭했을 때만 모달이 꺼짐.
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
