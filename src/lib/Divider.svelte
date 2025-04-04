<script>
	// Svelte 5의 Rune을 사용
	let { isDragging, position, min, max } = $state({
		isDragging: false,
		position: 0,
		min: 50,
		max: 500
	});

	// 부모 컴포넌트에서 전달받은 패널 크기 조정 함수
	let { onResize } = $props();

	// 드래그 시작
	function startDrag(event) {
		isDragging = true;
		position = event.clientX;
	}

	// 드래그 중
	function drag(event) {
		if (!isDragging) return;

		let newPosition = event.clientX;
		// 최소/최대 범위 내에서 제한
		if (newPosition < min) newPosition = min;
		if (newPosition > max) newPosition = max;

		position = newPosition;
		onResize(newPosition); // 부모 컴포넌트에 새 위치 전달
	}

	// 드래그 종료
	function stopDrag() {
		isDragging = false;
	}

	// 전역 이벤트 리스너 관리
	$effect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', drag);
			window.addEventListener('mouseup', stopDrag);
			return () => {
				window.removeEventListener('mousemove', drag);
				window.removeEventListener('mouseup', stopDrag);
			};
		}
	});
</script>

<button
	class="divider"
    aria-label="Resize"
	class:dragging={isDragging}
	style="left: {position}px;"
	onmousedown={startDrag}
></button>

<style>
	.divider {
		position: absolute;
		width: 5px;
		height: 100%;
		background: #666;
		cursor: ew-resize;
		user-select: none;
	}

	.divider.dragging {
		background: #999;
	}
</style>
