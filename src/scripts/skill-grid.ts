let transition = 0;
const grid = document.querySelector(".skill-grid");
document.querySelectorAll(".skill-cell > input").forEach(el => {
	const inputEl = el as HTMLInputElement;

	grid?.classList.add("script-active");
	el.addEventListener("change", e => {
		if(inputEl.checked) {
			e.preventDefault();
		}
	});
	el.parentElement?.addEventListener("transitionend", (e: TransitionEvent) => {
		const targetEl = e.target;
		if(targetEl instanceof HTMLElement && targetEl.classList.contains("toggled") && e.propertyName == "flex-basis") {
			if(targetEl.classList.contains("toggled")) {
				inputEl.checked = false;
				targetEl.classList.remove("toggled");
			}
			else {
				el.parentElement?.classList.add("toggled");
			}
		}
	});
});