export function navigate(path: string) {
	const url = new URL(path, location.href);
	if (url.pathname === "/docs/alert") url.pathname = "/docs/callout";
	if (url.pathname === location.pathname && url.search === location.search) return;
	history.pushState(null, "", url.pathname + url.search);
	window.dispatchEvent(new PopStateEvent("popstate"));
}
function migrateHash() {
	if (location.pathname === "/" && /^#[a-z][\w/-]*$/.test(location.hash)) {
		history.replaceState(null, "", "/" + location.hash.slice(1) + location.search);
		window.dispatchEvent(new PopStateEvent("popstate"));
	}
}
migrateHash();
if (location.pathname === "/docs/alert")
	history.replaceState(null, "", "/docs/callout" + location.search + location.hash);
window.addEventListener("hashchange", migrateHash);
document.addEventListener("click", (event) => {
	if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
		return;
	const link = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
	if (!link || link.target || link.hasAttribute("download")) return;
	const url = new URL(link.href);
	if (url.origin !== location.origin || url.hash || /\.[a-z0-9]+$/i.test(url.pathname)) return;
	event.preventDefault();
	navigate(url.pathname + url.search);
});
